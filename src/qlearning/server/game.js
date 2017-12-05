import Food from './food'
import Bot from './bot'

let settings = null

class Game {
  init (clientSettings) {
    settings = clientSettings
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    for (let i = 0; i < settings.food.amount; i++) {
      this.food.push(new Food(settings))
    }

    for (let j = 0; j < settings.bots; j++) {
      let bot = new Bot(j, settings)
      bot.init()
      this.bots.push(bot)
    }
  }

  get state () {
    return {
      food: this.food.map(f => {
        return {x: f.x, y: f.y, area: f.area}
      }),
      bots: this.bots.map(b => {
        return {index: b.index, x: b.x, y: b.y, area: b.area}
      }),
      me: null
    }
  }

  update () {
    for (let bot of this.bots) {
      try {
        let currentState = this.state
        currentState.me = {index: bot.index, x: bot.x, y: bot.y, area: bot.area}
        bot.update(currentState)
      } catch (e) {
        console.error(e)
        process.exit(0)
      }
    }
  }

}

export default (new Game())
