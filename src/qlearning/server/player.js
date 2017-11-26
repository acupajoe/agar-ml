import ql from 'q-exp'
import randomWords from 'random-words'

let settings
let actions = [
  'move-north',
  'move-south',
  'move-east',
  'move-west',
  'move-north-east',
  'move-north-west',
  'move-south-east',
  'move-south-west'
]

export default class Player {
  constructor (clientSettings) {
    settings = clientSettings

    this.lastState = null
    this.name = randomWords(3).reduce((a, b) => a.concat(`-${b}`))
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.agent = ql.newAgent(this.name, actions, 0.35)
      .then(ql.bindRewardMeasure(this.calculateReward))
      .then(ql.bindActionCostMeasure(this.calculateActionCostMeasure))
      .then(ql.bindStateGenerator(this.findNextStates))
  }

  calculateReward () {

  }

  calculateActionCostMeasure () {}

  findNextStates () {}

  bind () {}

  update () {
    this.agent.then(ql.setState(this.lastState))
      .then(ql.step)
      .then(ql.getState)
      .then((state) => {
        console.log(state)
      })
  }

  reset () {}
}
