import Entity from '../../entity'
import settings from '../settings'

export default class Food extends Entity {
  constructor (x, y) {
    super()
    this.x = x || Math.floor(Math.random() * settings.width)
    this.y = y || Math.floor(Math.random() * settings.height)
    this.area = settings.food.area

    this.color = [124, 252, 0]
  }

  draw () {
    this.radius = Math.sqrt(this.area / Math.PI)

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    ellipse(this.x, this.y, this.radius)
  }

  reset () {
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
  }

  update () {}
}
