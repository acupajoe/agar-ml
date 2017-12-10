import Food from './food'
import settings from '../settings'
import { activationColor, distance } from '../../utils'

let actions = [
  {x: 1, y: 1},
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: -1},
  {x: -1, y: 0},
  {x: -1, y: -1}
]

export default class RandomizedBot {
  constructor (x, y) {
    this.x = x || Math.floor(Math.random() * settings.width)
    this.y = y || Math.floor(Math.random() * settings.height)
    this.area = settings.area.min
    this.visualArea = this.area
    this.isDead = false
    this.score = 0
  }

  update () {
    if (this.isDead) {
      this.area = 0
      return
    }

    let action = actions[Math.floor(Math.random() * (actions.length))]
    let vx = action.x * settings.speed.normal
    let vy = action.y * settings.speed.normal

    // Speed should be affected by size (larger = more cumbersome)
    vx *= Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)
    vy += Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)

    this.x += vx
    this.y += vy

    window.Game.food.forEach(f => this.eat(f))
    window.Game.bots.forEach(b => this.eat(b))
    window.Game.randomBots.forEach(b => {
      if (b === this) return
      this.eat(b)
    })

    if (window.Game.player) {
      this.eat(window.Game.player)
    }

    this.area *= settings.size.decrease
    if (this.area > settings.area.max) this.area = settings.area.max
    if (this.area < settings.area.min) this.area = settings.area.min

    this.x = this.x >= settings.width ? settings.width : this.x <= 0 ? 0 : this.x
    this.y = this.y >= settings.height ? settings.height : this.y <= 0 ? 0 : this.y

    this.score = this.area
    if (this.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.score)
    }

    if (this.score > window.Game.roundHighestFitness) {
      window.Game.roundHighestFitness = this.score
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

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = activationColor(this.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)
  }
}