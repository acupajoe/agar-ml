import settings from '../settings'
import Trainer from './trainer'
import Food from './food'
import savedPositions from './positions.json'

class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.randomBots = []
    this.player = null
    this.iterations = 0
    this.highestFitness = 0
    this.roundHighestFitness = 0

    createCanvas(settings.width, settings.height)

    this.reset()

    if (!settings.isTrainedPop) {
      for (let j = 0; j < 15; j++) {
        Trainer.neat.mutate()
      }
    }
  }

  reset () {
    this.food = []
    this.bots = []
    this.randomBots = []
    this.player = null
    this.roundHighestFitness = 0

    for (let i = 0; i < settings.food.amount; i++) {
      if (settings.shouldUseSavedPositions) {
        let item = savedPositions.food[i % savedPositions.food.length]
        this.food.push(new Food(item.x, item.y))
      } else {
        this.food.push(new Food())
      }
    }
  }

  print () {
    let out = {
      food: this.food.map(f => {
        return {x: f.x, y: f.y}
      }),
      bots: this.bots.map(b => {
        return {x: b.x, y: b.y}
      })
    }
    console.log(JSON.stringify(out))
  }

  update () {
    if (this.iterations === settings.iterations) {
      Trainer.end()
      this.iterations = 0
    }

    for (let bot of this.bots) {
      bot.update()
    }

    for (let bot of this.randomBots) {
      bot.update()
    }

    if (this.player) {
      this.player.update()
    }
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
    this.drawBots()
    this.drawRandomizedBots()
    this.drawPlayer()

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

  drawRandomizedBots () {
    for (let bot of this.randomBots) {
      bot.draw()
    }
  }

  drawPlayer () {
    if (this.player) {
      this.player.draw()
    }
  }
}

export default Game
