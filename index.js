const express = require('express')
const mongoose = require('mongoose')
const app = express()
const routes = require('./routes')

/* Lets keep configuration simple */
PORT = process.env.PORT || 8000

MONGO_DB_URI = process.env.NODE_ENV == 'production'
  ? process.env.MONGODB_URI
  : 'mongodb://localhost/bain-example-db'


mongoose.Promise = Promise

const mongoConnectOpts = {
  reconnectTries: 30,
  reconnectInterval: 1000,
  socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
}

const conn = mongoose.connect(MONGO_DB_URI, {
  server: mongoConnectOpts,
  replset: mongoConnectOpts
})

app.get('/', (req, res) => {
  res.send('Try querying the GET /providers endpoint!')
})

app.get('/providers', (req, res) => {
  routes.getProviders(req.query, function(err, data) {
    if (err) return res.status(500).send(err)
    res.send(data)
  })
})

app.post('/bootstrap', (req, res) => {
  routes.loadData(function(err) {
    if (err) return res.status(500).send(err)
    res.send('Data was loaded')
  })
})

app.post('/drop-db', (req, res) => {
  conn.connection.dropDatabase(err => {
    if (err) return res.status(500).send(err)
    res.send('DB was Dropped')
  })
})

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`)
})