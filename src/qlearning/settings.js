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
  players: 5,
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
  shouldShowDetection: false,
  isTrainedPop: true
}
