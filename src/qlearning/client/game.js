import settings from '../settings'
import { activationColor } from '../../utils'

class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    createCanvas(settings.width, settings.height)
  }

  update (food, bots) {
    if (food) {
      this.food = food
    }
    if (bots) {
      this.bots = bots
    }
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
    this.drawPlayers()
  }

  drawGrid () {
    let spacing = 25
    stroke(204, 204, 204, 160)
    fill(255)

    for (let x = 0; x < settings.width / spacing; x++) {
      line(x * spacing, 0, x * spacing, settings.height)
    }

    for (let y = 0; y < settings.height / spacing; y++) {
      line(0, y * spacing, settings.width, y * spacing)
    }

    noStroke()
  }

  drawFood () {
    for (let food of this.food) {
      let radius = Math.sqrt(food.area / Math.PI)

      fill(124, 252, 0)
      noStroke()
      ellipse(food.x, food.y, radius)
    }
  }

  drawPlayers () {
    for (let player of this.bots) {
      let radius = Math.sqrt(player.area / Math.PI)

      fill(activationColor(player.area, settings.area.max))
      noStroke()
      ellipse(player.x, player.y, radius)
    }
  }
}

export default Game
