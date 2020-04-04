'use strict'

const axios = require('axios')
const common = require('./common')

const inputDate = (dt) => {
    return dt.toISOString().slice(0,10)
}

const dates = (departureStation, arrivalStation, from, to, callback) => {
    let URL = 'https://be.wizzair.com/10.17.1/Api/search/flightDates?'
    URL += common.encodeURIParameters({
      departureStation,
      arrivalStation,
      from: inputDate(from),
      to: inputDate(to)
    })
    axios(URL).then(response => {
      callback(response.data)
    })
}

const search = (departureStation, arrivalStation, departureDate, callback) => {
    let payload = {
      isFlightChange: false,
      isSeniorOrStudent: false,
      flightList: [{
        departureStation,
        arrivalStation,
        departureDate: inputDate(departureDate)
      }],
      adultCount: 1,
      childCount: 0,
      infantCount: 0,
      wdc: true
    }
    let URL = 'https://be.wizzair.com/10.17.1/Api/search/search'
    axios.post(URL, payload).then(response => {
      callback(response.data)
    })
}

module.exports = {
    dates,
    search
}
