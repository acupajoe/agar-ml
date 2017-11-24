import settings from './settings'

const activationColor = (value, max) => {
  let power = 1 - Math.min(value / max, 1)
  let color = [255, 255, 0]

  if (power < 0.5) {
    color[0] = 2 * power * 255
  } else {
    color[1] = (1.0 - 2 * (power - 0.5)) * 255
  }

  return color
}

const angleToPoint = (x1, y1, x2, y2) => {
  let d = distance(x1, y1, x2, y2)
  let dx = (x2 - x1) / d
  let dy = (y2 - y1) / d

  let a = Math.acos(dx)
  return dy < 0 ? 2 * Math.PI - a : a
}

const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

export default class Bot {
  constructor (genome) {
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.vx = 0 // velocity x
    this.vy = 0 // velocity y

    this.cognition = genome
    this.cognition.score = 0
    this.area = settings.area.min
    this.visualArea = this.area
    this.aggro = this.area
  }

  update () {
    if (this.area > settings.area.max) this.area = settings.area.max
    if (this.area < settings.area.min) this.area = settings.area.min

    let input = this.detect()
    let output = this.cognition.activate(input)

    let movementAngle = output[0] * 2 * Math.PI
    let movementSpeed = output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1]

    this.vx = movementSpeed * Math.cos(movementAngle) * settings.speed.normal
    this.vy = movementSpeed * Math.sin(movementAngle) * settings.speed.normal

    // Speed should be affected by size (larger = more cumbersome)
    this.vx *= Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)
    this.vy += Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)

    this.x += this.vx
    this.y += this.vy

    // Force bot to stay in bounds
    this.x = this.x >= settings.width ? this.x % settings.width : this.x <= 0 ? this.x + settings.width : this.x
    this.y = this.y >= settings.height ? this.y % settings.height : this.y <= 0 ? this.y + settings.height : this.y

    this.area *= settings.size.decrease

    this.cognition.score = this.area

    // Do we do better?
    if (this.cognition.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.cognition.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.cognition.score)
    }
  }

  draw () {
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = activationColor(this.cognition.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)
  }

  reset () {
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.vx = 0
    this.vy = 0
    this.area = settings.area.min
    this.visualArea = this.area
  }

  eat (obj) {
    let d = distance(this.x, this.y, obj.x, obj.y)
    let r1 = Math.sqrt(this.area / Math.PI)
    let r2 = Math.sqrt(obj.area / Math.PI)

    if (d < (r1 + r2) / 2 && this.area > obj.area * settings.size.relative) {
      this.area += obj.area
      obj.reset()
      return true
    }
    return false
  }

  detect () {
    let output = [this.area / settings.area.max]

    let nearestFood = []
    let distanceToFood = Array.apply(null, Array(settings.detection.food)).map(Number.prototype.valueOf, Infinity)

    let nearestPlayers = []
    let distanceToPlayers = Array.apply(null, Array(settings.detection.player)).map(Number.prototype.valueOf, Infinity)

    for (let player of window.Game.bots) {
      if (player === this || this.eat(player)) continue

      let d = distance(this.x, this.y, player.x, player.y)
      if (d < settings.detection.radius) {
        let maxNearestDistance = Math.max.apply(null, distanceToPlayers)
        let i = distanceToPlayers.indexOf(maxNearestDistance)

        if (d < maxNearestDistance) {
          distanceToPlayers[i] = d
          nearestPlayers[i] = player
        }
      }
    }

    for (let food of window.Game.food) {
      if (this.eat(food)) continue

      let d = distance(this.x, this.y, food.x, food.y)
      if (d < settings.detection.radius) {
        let maxNearestDistance = Math.max.apply(null, distanceToFood)
        let i = distanceToFood.indexOf(maxNearestDistance)

        if (d < maxNearestDistance) {
          distanceToFood[i] = d
          nearestFood[i] = food
        }
      }
    }

    for (let i = 0; i < settings.detection.player; i++) {
      let player = nearestPlayers[i]
      let d = distanceToPlayers[i]

      if (player === undefined) {
        output = output.concat([0, 0, 0])
      } else {
        output.push(angleToPoint(this.x, this.y, player.x, player.y) / (2 * Math.PI))
        output.push(d / settings.detection.radius)
        output.push(player.area / settings.area.max)
      }
    }

    for (let j = 0; j < settings.detection.food; j++) {
      let food = nearestFood[j]
      let d = distanceToFood[j]

      if (food === undefined) {
        output = output.concat([0, 0])
      } else {
        output.push(angleToPoint(this.x, this.y, food.x, food.y) / (2 * Math.PI))
        output.push(d / settings.detection.radius)
      }
    }

    return output
  }
}
