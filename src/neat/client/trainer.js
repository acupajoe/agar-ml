import Bot from './bot'

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
    window.Game.bots = []
    for (let genome of this.neat.population) {
      window.Game.bots.push(new Bot(genome))
    }
    document.getElementById('generation').innerText = this.neat.generation.toString()
  }

  end () {
    let newPopulation = []

    console.log(`Generation: ${this.neat.generation}, Avg Score: ${this.neat.getAverage()}`)

    document.getElementById('average-fitness').innerText = Math.floor(this.neat.getAverage())

    window.Chart.data.labels.push(`Gen. ${this.neat.generation + 1}`)
    window.Chart.data.datasets[0].data.push({x: this.neat.generation + 1, y: this.neat.getAverage()})
    window.Chart.update()

    this.neat.sort()

    for (let i = 0; i < this.neat.elitism; i++) {
      newPopulation.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newPopulation.push(this.neat.getOffspring())
    }

    $.post('http://localhost:3000/store', {
      generation: this.neat.generation + 1,
      data: JSON.stringify(newPopulation)
    })

    this.neat.population = newPopulation
    this.neat.mutate()
    this.neat.generation++

    if (this.neat.generation < settings.maxGenerations) {
      this.start()
    }
  }
}

export default (new Trainer())
