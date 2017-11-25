let width = window.innerWidth
let height = 600

module.exports = {
  width: width,
  height: height,
  area: {
    min: 7500,
    max: 30000
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
    area: 750,
    amount: Math.round(width * height * 4e-4)
  },
  bots: 15,
  iterations: 750,
  maxGenerations: 1000,
  startingHiddenSize: 2,
  mutationRate: 0.275,
  elitismPercent: 0.15,
  shouldShowDetection: false,
  isTrainedPop: false
}
