const request = require('request')
const csv = require('csvtojson')

const URL = 'https://s3-us-west-2.amazonaws.com/bain-coding-challenge/Inpatient_Prospective_Payment_System__IPPS__Provider_Summary_for_the_Top_100_Diagnosis-Related_Groups__DRG__-_FY2011.csv'

function numerify(str) {
  let vals = str.split('')
  vals = vals.filter(a => {
    return a !== ',' && a !== '$'
  })
  return Number(vals.join(''))
}

module.exports = function downloadData(callback) {
  const jsonData = []
  csv()
    .fromStream(request.get(URL))
    .on('json',(json) => {
       jsonData.push(json)
    })
    .on('done',(error) => {
      if (error) {
        callback(error)
      }

      /* Turn strings into numbers */
      result = jsonData.map((row) => {
        row['Total Discharges'] = Number(row['Total Discharges'])
        row['Average Covered Charges'] = numerify(row['Average Covered Charges'])
        row['Average Total Payments'] = numerify(row['Average Total Payments'])
        row['Average Medicare Payments'] = numerify(row['Average Medicare Payments'])
        return row
      })

      callback(null, result)
    })
}