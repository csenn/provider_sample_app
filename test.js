const routes = require('./routes')

const mongoose = require('mongoose')
mongoose.Promise = Promise
const conn = mongoose.connect('mongodb://localhost/bain-example-db')

after(() =>  conn.disconnect())

/*
  This is a simple set of unit tests testing our most interesting
  route. In production we would also likely want to build
  a suite of integration tests hitting endpoints directly.

  For a good test framework we should create specific controlled test
  data. But here for both dev speed and since we are only testing
  a simple endpoint we can just use the dev DB directly.
*/

describe('getProviders()', () => {
  it('should get all results', done => {
    routes.getProviders({limit: 100}, (err, data) => {
      if (err) return done(err)
      if (data.length !== 100) {
        return done('Should be 100 results')
      }
      return done(null)
    })
  })

  it('should fail with bad query param', done => {
    query = { hello: '25', limit: 20 }
    routes.getProviders(query, (err, data) => {
      /* Bad async test syntax, but proves the point */
      if (err) return done()
      return done(err)
    })
  })

  it('should test max discharges', done => {
    query = { max_discharges: '25', limit: 20 }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] > 25) {
          return done('Bad discharge number')
        }
      }
      return done(null)
    })
  })

  it('should test min discharges', done => {
    query = { min_discharges: '100', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] < 100) {
          return done('Bad discharge number')
        }
      }
      return done(null)
    })
  })

  it('should test min and max discharges', done => {
    query = {
      max_discharges: '25',
      min_discharges: '20',
      limit: '20'
    }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] > 25 || result['Total Discharges'] < 20) {
          return done('Bad discharge number')
        }
      }
      return done(null)
    })
  })

  it('should test max covered charges', done => {
    query = { max_average_covered_charges: '10000', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Covered Charges'] > 10000) {
          return done('Bad covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test min covered charges', done => {
    query = { min_average_covered_charges: '10000', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Covered Charges'] < 10000) {
          return done('Bad covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test max medicare', done => {
    query = { max_average_medicare_payments: '10000', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Medicare Payments'] > 10000) {
          return done('Bad medicare payments cost')
        }
      }
      return done(null)
    })
  })

  it('should test min medicare', done => {
    query = { min_average_medicare_payments: '10000', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Medicare Payments'] < 10000) {
          return done('Bad medicare payments cost')
        }
      }
      return done(null)
    })
  })

  it('should test state', done => {
    query = { state: 'AL', limit: '20' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Provider State'] !== 'AL') {
          return done('Bad state param')
        }
      }
      return done(null)
    })
  })


})


