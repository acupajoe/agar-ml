import settings from './settings'
import Trainer from './trainer'
import Food from './food'

class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    createCanvas(settings.width, settings.height)

    for (let i = 0; i < settings.food.amount; i++) {
      this.food.push(new Food())
    }

    if (!settings.isTrainedPop) {
      for (let j = 0; j < 15; j++) {
        Trainer.neat.mutate()
      }
    }
  }

  update () {
    if (this.iterations === settings.iterations) {
      Trainer.end()
      this.iterations = 0
    }

    for (let bot of this.bots) {
      bot.update()
    }
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
    this.drawBots()

    this.iterations++
    document.getElementById('iteration').innerText = `${this.iterations} / ${settings.iterations}`
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
      food.draw()
    }
  }

  drawBots () {
    for (let bot of this.bots) {
      bot.draw()
    }
  }
}

export default Game
