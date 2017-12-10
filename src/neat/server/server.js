const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const http = require('http')
const path = require('path')
const rimraf = require('rimraf')
const settings = require('../settings')

const port = process.env.PORT || 3000

let app = express()
let server = http.Server(app)

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use('/libs', express.static(path.join(__dirname, '../../../libs')))
app.use('/dist', express.static(path.join(__dirname, '../../../dist')))

if (settings.shouldRunClean) {
  rimraf.sync('../training-data')
}

app.get('/', (req, res, next) => {
  res.sendFile(path.join(path.resolve(__dirname, '..'), 'index.html'))
})

app.post('/store', (req, res, next) => {
  let generation = req.body.generation
  let data = req.body.data
  let average = req.body.averageFitness
  let roundHighestFitness = req.body.roundHighestFitness

  if (!fs.existsSync('../training-data')) {
    fs.mkdirSync('../training-data')
  }
  if (!fs.existsSync('../training-data/statistics.csv')) {
    fs.writeFileSync('../training-data/statistics.csv', '')
  }

  fs.appendFile('../training-data/statistics.csv', `${generation},${average},${roundHighestFitness}\n`, () => {
    fs.writeFile(`../training-data/generation-${generation}.json`, data, (err) => {
      res.json({stored: !err})
    })
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)
