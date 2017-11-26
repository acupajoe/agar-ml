import settings from '../settings'

class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    createCanvas(settings.width, settings.height)
  }

  update () {
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
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
    this.radius = Math.sqrt(this.area / Math.PI)

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    ellipse(this.x, this.y, this.radius)
  }
}

export default Game
