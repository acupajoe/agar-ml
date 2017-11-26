import Food from './food'
import Player from './player'

let settings

class Game {
  constructor (clientSettings) {
    settings = clientSettings
    this.food = []
    this.players = []
    this.iterations = 0
    this.highestFitness = 0

    for (let i = 0; i < settings.food.amount; i++) {
      this.food.push(new Food(settings))
    }

    for (let j = 0; j < settings.players; j++) {
      this.players.push(new Player(settings))
    }
  }

  update () {}
}

export default Game
