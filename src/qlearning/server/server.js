import Game from './game'
import { isEqual } from 'lodash'

const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const ql = require('q-exp')
const port = process.env.PORT || 3000

let app = express()
let server = http.Server(app)
let io = socketio(server)

app.use(bodyParser.urlencoded({extended: true}))
app.use('/libs', express.static(path.join(__dirname, '../../../libs')))
app.use('/dist', express.static(path.join(__dirname, '../../../dist')))

app.get('/', (req, res, next) => {
  res.send(require('../index.html'))
})

io.on('connection', (socket) => {
  let settings
  let isBlocked = false
  let lastFood = null

  socket.on('init', (clientSettings) => {
    settings = clientSettings
    Game.init(settings)
  })

  socket.on('tick', () => {
    let state
    let food
    if (!isBlocked) {
      isBlocked = true

      Game.update()

      state = Game.state
      food = (lastFood && isEqual(state.food, lastFood)) ? false : state.food
      socket.emit('tick', {bots: state.bots, food: food})

      lastFood = state.food
      isBlocked = false
    }
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)
