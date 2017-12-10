import Food from './food'
import settings from '../settings'
import { activationColor, distance } from '../../utils'

export default class Player {
  constructor (x, y) {
    this.x = x || Math.floor(Math.random() * settings.width)
    this.y = y || Math.floor(Math.random() * settings.height)
    this.area = settings.area.min
    this.visualArea = this.area
    this.score = 0
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

  update () {
    if (this.isDead) {
      this.area = 0
      this.score = 0
      return
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      let vx = 0
      let vy = 0
      if (keyIsDown(UP_ARROW)) { vy = -1 * settings.speed.normal }
      if (keyIsDown(DOWN_ARROW)) { vy = settings.speed.normal }
      if (keyIsDown(LEFT_ARROW)) { vx = -1 * settings.speed.normal }
      if (keyIsDown(RIGHT_ARROW)) { vx = settings.speed.normal }

      vx *= Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)
      vy *= Math.max(1 - (this.area / settings.area.max), settings.speed.min / settings.speed.normal)

      this.x += vx
      this.y += vy
    }

    window.Game.food.forEach(f => this.eat(f))
    window.Game.bots.forEach(b => this.eat(b))
    window.Game.randomBots.forEach(rb => this.eat(rb))
  }

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = [0, 0, 0]
    let strokeColor = activationColor(this.score, window.Game.highestFitness)

    stroke(strokeColor)
    fill(color)
    ellipse(this.x, this.y, radius)
  }
}
