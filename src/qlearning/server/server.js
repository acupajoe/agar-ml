import Game from './game'

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
  let game

  socket.on('init', (clientSettings) => {
    settings = clientSettings
    game = new Game(settings)
  })

  socket.on('tick', () => {
    game.update()
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)
