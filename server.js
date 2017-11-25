const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const port = process.env.PORT || 3000

let app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use('/libs', express.static(path.join(__dirname, 'libs')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))

rimraf.sync('./training-data')

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/store', (req, res, next) => {
  let generation = req.body.generation
  let data = req.body.data

  if (!fs.existsSync('./training-data')) {
    fs.mkdirSync('./training-data')
  }

  fs.writeFile(`./training-data/generation-${generation}.json`, data, (err) => {
    res.json({stored: !err})
  })
})

app.listen(port, () => console.log(`Listening on ::${port}`))
