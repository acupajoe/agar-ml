const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const http = require('http')
const path = require('path')
const rimraf = require('rimraf')
const port = process.env.PORT || 3000

let app = express()
let server = http.Server(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use('/libs', express.static(path.join(path.resolve(__dirname, '../../'), 'libs')))
app.use('/dist', express.static(path.join(path.resolve(__dirname, '../../'), 'dist')))

rimraf.sync('../training-data')

app.get('/', (req, res, next) => {
  res.sendFile(path.join(path.resolve(__dirname, '..'), 'index.html'))
})

app.post('/store', (req, res, next) => {
  let generation = req.body.generation
  let data = req.body.data

  if (!fs.existsSync('../training-data')) {
    fs.mkdirSync('../training-data')
  }

  fs.writeFile(`../training-data/generation-${generation}.json`, data, (err) => {
    res.json({stored: !err})
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)
