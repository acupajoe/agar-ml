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
  })

  // Handle a draw tick
  window.socket.on('tick', (data) => {

  })
}

window.draw = () => {
  window.socket.emit('tick') // <-- see method in setup
}
