let width = 1000
let height = 600

module.exports = {
  width: width,
  height: height,
  area: {
    min: 7500,
    max: 500000
  },
  size: {
    relative: 1.1,
    decrease: 0.9995
  },
  detection: {
    food: 3,
    player: 3,
    radius: 250
  },
  speed: {
    min: 0.5,
    normal: 2
  },
  food: {
    area: 750,
    amount: 650
  },
  bots: 5,
  randomBots: 0,
  iterations: 750,
  maxGenerations: 100,
  startingHiddenSize: 0,
  mutationRate: 0.3,
  elitismPercent: 0.1,
  shouldShowDetection: false,
  shouldUseSavedPositions: true,
  shouldRunClean: false,
  hasHumanControlledPlayer: true,
  isTrainedPop: false
}
