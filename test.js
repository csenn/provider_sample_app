const routes = require('./routes')

const mongoose = require('mongoose')
mongoose.Promise = Promise
const conn = mongoose.connect('mongodb://localhost/bain-example-db')

after(() =>  conn.disconnect())

/*
  For a good test framework we should create specific test
  data. But for speed and since here we are only testing a simple endpoint
  we can just use the DB directly
*/

describe('getProviders()', () => {
  it('should test max discharges', done => {
    query = { max_discharges: '25' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] > 25) {
          return done('Too many discharges')
        }
      }
      return done(null)
    })
  })

  it('should test min discharges', done => {
    query = { min_discharges: '100' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] < 100) {
          return done('Too many discharges')
        }
      }
      return done(null)
    })
  })

  it('should test min and max discharges', done => {
    query = {
      max_discharges: '25',
      min_discharges: '20'
    }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Total Discharges'] > 25 || result['Total Discharges'] < 20) {
          return done('Too many discharges')
        }
      }
      return done(null)
    })
  })

  it('should test max covered charges', done => {
    query = { max_average_covered_charges: '10000' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Covered Charges'] > 10000) {
          return done('Too many covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test min covered charges', done => {
    query = { min_average_covered_charges: '10000' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Covered Charges'] < 10000) {
          return done('Too many covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test max medicare', done => {
    query = { max_average_medicare_payments: '10000' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Medicare Payments'] > 10000) {
          return done('Too many covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test min medicare', done => {
    query = { min_average_medicare_payments: '10000' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Average Medicare Payments'] < 10000) {
          return done('Too many covered charges')
        }
      }
      return done(null)
    })
  })

  it('should test state', done => {
    query = { state: 'AL' }
    routes.getProviders(query, (err, data) => {
      if (err) return done(err)
      for (let result of data) {
        if (result['Provider State'] !== 'AL') {
          return done('Too many covered charges')
        }
      }
      return done(null)
    })
  })


})


