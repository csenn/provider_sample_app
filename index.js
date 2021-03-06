const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const app = express()

mongoose.Promise = Promise

/* Lets keep configuration simple */
PORT = process.env.PORT || 8000

/* Provided by Heroku in production */
MONGO_DB_URI = process.env.NODE_ENV == 'production'
  ? process.env.MONGODB_URI
  : 'mongodb://localhost/bain-example-db'

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
  res.send('Try querying the GET /providers endpoint')
})

/* Main endpoint */
app.get('/providers', (req, res) => {
  routes.getProviders(req.query, (err, data) => {
    if (err) return res.status(500).send(err)
    res.send(data)
  })
})

/* Returns full record count */
app.get('/providers-size', (req, res) => {
  routes.getProvidersSize((err, count) => {
    if (err) return res.status(500).send(err)
    res.send({count: count})
  })
})

/* Pulls csv from provided url and uploads it to mongo */
app.post('/bootstrap', (req, res) => {
  routes.loadData(err => {
    if (err) return res.status(500).send(err)
    res.send('Data was loaded')
  })
})

/* Drops database for convenience. Not for a real application */
app.post('/drop-db', (req, res) => {
  conn.connection.dropDatabase(err => {
    if (err) return res.status(500).send(err)
    res.send('DB was Dropped')
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
