const mongoose = require('mongoose')
const formatCurrency = require('format-currency')

const currencyOpts = {
  format: '%s%v',
  symbol: '$'
}

const currencyKeys = [
  'Average Covered Charges',
  'Average Total Payments',
  'Average Medicare Payments'
]

/*
  Usually would try to avoid spaces and capitals in keys,
  but this is simpler for this small project
*/

const schema = new mongoose.Schema({
  'Provider Name': { type: String },
  'Provider Street Address': { type: String },
  'Provider City': { type: String },
  'Provider State': { type: String, index: true },
  'Provider Zip Code': { type: String },
  'Hospital Referral Region Description': { type: String },
  'Total Discharges': { type: Number, index: true },
  'Average Covered Charges': { type: Number, index: true },
  'Average Total Payments': { type: Number },
  'Average Medicare Payments': { type: Number, index: true }
}, {

  /* Simple way to convert currency back to a string when returned */
  toJSON: {
    transform: function (doc, ret) {
      currencyKeys.forEach(key => {
        delete ret['_id']
        if (key in ret) {
          ret[key] = formatCurrency(ret[key], currencyOpts)
        }
      })
    }
  }
})

module.exports = mongoose.model('Provider', schema)
