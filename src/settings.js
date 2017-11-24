let width = window.innerWidth
let height = 600

module.exports = {
  width: width,
  height: height,
  area: {
    min: 1000,
    max: 10000
  },
  size: {
    relative: 1.1,
    decrease: 0.998
  },
  detection: {
    food: 3,
    player: 3,
    radius: 250
  },
  speed: {
    min: 0.3,
    normal: 2
  },
  food: {
    area: 100,
    amount: Math.round(width * height * 4e-4)
  },
  bots: 15,
  iterations: 1000,
  startingHiddenSize: 0,
  mutationRate: 0.4,
  elitismPercent: 0.3,
  isTrainedPop: false
}
