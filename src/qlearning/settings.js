let width
let height
let origin

if (typeof window !== 'undefined') {
  width = window.innerWidth
  height = 600
  origin = window.location ? `${window.location.protocol}//${window.location.host}` : null
}

module.exports = {
  origin: origin,
  width: width,
  height: height,
  bots: 4,
  area: {
    min: 7500,
    max: 30000
  },
  size: {
    relative: 1.1,
    decrease: 0.998
  },
  vision: {
    food: 150,
    player: 150
  },
  reward: {
    tick: 1,
    doNothing: -1,
    eatFood: 250,
    consumePlayer: 1000,
    die: -Infinity
  },
  speed: {
    min: 0.3,
    normal: 2
  },
  food: {
    area: 750,
    amount: Math.round(width * height * 4e-4)
  },
  lessons: 50,
  shouldShowDetection: false,
  isTrainedPop: true
}
