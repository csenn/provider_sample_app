const fs = require('fs')
const provider = require('./model')
const downloadData = require('./downloadData')
const lodash = require('lodash')

/* Simple query validation, would usually either use
a library or at least a more sophisticated strategy */
const QUERY_PARAMS = {
  max_discharges: lodash.isString,
  min_discharges: lodash.isString,
  max_average_covered_charges: lodash.isString,
  min_average_covered_charges: lodash.isString,
  max_average_medicare_payments: lodash.isString,
  min_average_medicare_payments: lodash.isString,
  state: lodash.isString
}

function getProviders(query, callback) {

  /* First do query validation */
  if (!query) {
    return callback('Query is required')
  }

  const keys = Object.keys(query)

  if (keys.length === 0) {
    return callback('Require at least one query_param')
  }

  for (let key of keys) {
    const validator = QUERY_PARAMS[key]
    if (!validator) {
      return callback(`We do not accept query ${key}`)
    }
    if (!validator(query[key])) {
      return callback(`Bad type for query ${key}`)
    }
  }

  /* Next build mongo query */
  const dbQuery = {}

  if ('state' in query) {
    dbQuery['Provider State'] = query.state
  }

  /* Convenience function to set mins and maxes if they exist */
  const buildQuery = (name, maxKey, minKey) => {
    if (maxKey in query || minKey in query) {
      dbQuery[name] = {}
      if (maxKey in query) {
        dbQuery[name]['$lte'] = query[maxKey]
      }
      if (minKey in query) {
        dbQuery[name]['$gte'] = query[minKey]
      }
    }
  }

  buildQuery(
    'Total Discharges',
    'max_discharges',
    'min_discharges'
  )
  buildQuery(
    'Average Covered Charges',
    'max_average_covered_charges',
    'min_average_covered_charges'
  )
  buildQuery(
    'Average Medicare Payments',
    'max_average_medicare_payments',
    'min_average_medicare_payments'
  )

  provider.find(dbQuery)
    .limit(10)
    .exec(callback)
}

function loadData(callback) {
  provider.count((err, result) => {
    if (err) {
      callback(err)
    }

    // Already bootstrapped
    if (result > 0) {
      callback(null)
    }

    // Download the data and then batch insert it into mongo
    downloadData((err, json) => {
      if (err) {
        callback(err)
      }
      provider.collection.insert(json, callback)
    })
  })
}

module.exports = {
  loadData: loadData,
  getProviders: getProviders
}