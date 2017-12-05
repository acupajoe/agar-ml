import Game from './game'
import io from '../../../libs/socket.io'
import settings from '../settings'

window.Game = null

window.setup = () => {
  window.Game = new Game()
  window.socket = io(settings.origin)

  // Set server's settings for creating the game
  window.socket.on('connect', () => {
    window.socket.emit('init', settings)
     // window.socket.emit('tick')
  })

  // Handle a draw tick
  window.socket.on('tick', (data) => {
    window.Game.update(data.food, data.bots)
    window.Game.draw()
  })
}

let limit = 100
let lastDraw = Date.now()
window.draw = () => {
  let now = Date.now()
  if ((now - lastDraw) > limit) {
    window.socket.emit('tick') // <-- see method in setup
    lastDraw = Date.now()
  }
}
