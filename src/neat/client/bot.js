import Entity from '../../entity'
import Food from './food'
import settings from '../settings'
import { activationColor, angleToPoint, distance } from '../../utils'

export default class Bot extends Entity {
  constructor (genome, x, y) {
    super()
    this._x = x
    this._y = y
    this.x = this._x || Math.floor(Math.random() * settings.width)
    this.y = this._y || Math.floor(Math.random() * settings.height)
    this.vx = 0 // velocity x
    this.vy = 0 // velocity y

    this.cognition = genome
    this.cognition.score = 0
    this.area = settings.area.min
    this.visualArea = this.area
    this.aggro = this.area
    this.detected = []
    this.isDead = false
  }

  update () {
    if (this.isDead) {
      this.area = 0
      return
    }

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
    this.x = this.x >= settings.width ? settings.width : this.x <= 0 ? 0 : this.x
    this.y = this.y >= settings.height ? settings.height : this.y <= 0 ? 0 : this.y

    this.area *= settings.size.decrease

    this.cognition.score = this.area

    // Do we do better?
    if (this.cognition.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.cognition.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.cognition.score)
    }
    if (this.cognition.score > window.Game.roundHighestFitness) {
      window.Game.roundHighestFitness = this.cognition.score
    }
  }

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = activationColor(this.cognition.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)

    if (settings.shouldShowDetection || distance(mouseX, mouseY, this.x, this.y) < Math.sqrt(this.visualArea / Math.PI)) {
      this.showDetection()
    }
  }

  reset () {
    this.x = this._x || Math.floor(Math.random() * settings.width)
    this.y = this._y || Math.floor(Math.random() * settings.height)
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
      if (obj instanceof Food) {
        obj.reset()
      } else {
        obj.isDead = true
      }
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

    if (window.Game.player) {
      this.eat(window.Game.player)
    }

    for (let player of window.Game.bots.concat(window.Game.randomBots)) {
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

    this.detected = nearestPlayers.concat(nearestFood)
    return output
  }

  showDetection () {
    noFill()
    for (let obj of this.detected) {
      if (obj !== undefined) {
        stroke(obj instanceof Bot ? 'red' : 'lightgreen')
        line(this.x, this.y, obj.x, obj.y)
      }
    }

    let color = activationColor(this.cognition.score, window.Game.highestFitness)
    stroke(color)
    ellipse(this.x, this.y, settings.detection.radius * 2)
  }
}
