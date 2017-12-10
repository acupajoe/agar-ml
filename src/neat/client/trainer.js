import Bot from './bot'
import RandomizedBot from './randomizedBot'
import savedPositions from './positions.json'
import Player from './player'

const settings = require('../settings')

const Neat = neataptic.Neat
const Methods = neataptic.Methods
const Network = neataptic.Network
const Architect = neataptic.Architect

class Trainer {
  constructor () {
    this.neat = new Neat(
      1 + settings.detection.player * 3 + settings.detection.food * 2,
      2,
      null,
      {
        mutation: [
          Methods.Mutation.ADD_NODE,
          Methods.Mutation.SUB_NODE,
          Methods.Mutation.ADD_CONN,
          Methods.Mutation.SUB_CONN,
          Methods.Mutation.MOD_WEIGHT,
          Methods.Mutation.MOD_BIAS,
          Methods.Mutation.MOD_ACTIVATION,
          Methods.Mutation.ADD_GATE,
          Methods.Mutation.SUB_GATE,
          Methods.Mutation.ADD_SELF_CONN,
          Methods.Mutation.ADD_BACK_CONN,
          Methods.Mutation.SUB_BACK_CONN
        ],
        popsize: settings.bots,
        mutationRate: settings.mutationRate,
        elitism: Math.round(settings.elitismPercent * settings.bots),
        network: new Architect.Random(
          1 + settings.detection.player * 3 + settings.detection.food * 2,
          settings.startingHiddenSize,
          2
        )
      })
    if (settings.isTrainedPop) {
      let population = []
      const saved = require('./trained-population.json')
      for (let i = 0; i < settings.bots; i++) {
        let json = saved[i % saved.length]
        population.push(Network.fromJSON(json))
      }
      this.neat.population = population
    }
  }

  start () {
    window.Game.reset()
    window.Game.bots = []
    let cursor = 0

    // Create NEAT Bots
    if (settings.bots > 0) {
      for (let genome of this.neat.population) {
        if (settings.shouldUseSavedPositions) {
          let item = savedPositions.bots[cursor % savedPositions.bots.length]
          window.Game.bots.push(new Bot(genome, item.x, item.y))
        } else {
          window.Game.bots.push(new Bot(genome))
        }
        cursor++
      }
      // window.Game.print()
    }

    // Create Randomized Bots
    if (settings.randomBots > 0) {
      for (let i = 0; i < settings.randomBots; i++) {
        if (settings.shouldUseSavedPositions) {
          let item = savedPositions.bots[cursor % savedPositions.bots.length]
          window.Game.randomBots.push(new RandomizedBot(item.x, item.y))
        } else {
          window.Game.randomBots.push(new RandomizedBot())
        }
        cursor++
      }
    }

    // Create Player instance
    if (settings.hasHumanControlledPlayer) {
      if (settings.shouldUseSavedPositions) {
        let item = savedPositions.bots[cursor % savedPositions.bots.length]
        window.Game.player = new Player(item.x, item.y)
      } else {
        window.Game.player = new Player()
      }
    }

    document.getElementById('generation').innerText = this.neat.generation.toString()
  }

  end () {
    let newPopulation = []

    let randomBotsAvg = window.Game.randomBots.reduce((a, b) => a + b.score, 0) / window.Game.randomBots.length
    let average = settings.bots > 0 ? this.neat.getAverage() : randomBotsAvg

    console.log(`Generation: ${this.neat.generation}, Avg Score: ${average}`)

    window.Chart.data.labels.push(`Gen. ${this.neat.generation + 1}`)
    window.Chart.data.datasets[0].data.push({x: this.neat.generation + 1, y: average})
    window.Chart.update()

    document.getElementById('average-fitness').innerText = Math.floor(average)

    $.post('http://localhost:3000/store', {
      generation: this.neat.generation + 1,
      data: newPopulation ? JSON.stringify(newPopulation) : null,
      averageFitness: average,
      roundHighestFitness: window.Game.roundHighestFitness
    })

    if (settings.bots > 0) {
      this.neat.sort()

      for (let i = 0; i < this.neat.elitism; i++) {
        newPopulation.push(this.neat.population[i])
      }

      for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
        newPopulation.push(this.neat.getOffspring())
      }
      this.neat.population = newPopulation
      this.neat.mutate()
    }

    this.neat.generation++
    if (this.neat.generation < settings.maxGenerations) {
      this.start()
    }
  }
}

export default (new Trainer())
