'use strict'

const axios = require('axios')

const common = require('./common')

const inputDate = (dt) => {
    return dt.toISOString().slice(0,10)
}

const airportMeta = (code, callback) => {
    let URL = 'https://www.ryanair.com/api/locate/v1/autocomplete/airports?'
    URL += common.encodeURIParameters({
        phrase: code,
        market: 'en-ie'
    })
    axios(URL).then(response => {
        callback(response.data)
    })
}

const search = (departureStation, arrivalStation, departureDate, callback) => {
    let URL = 'https://www.ryanair.com/api/booking/v4/en-ie/availability?'
    URL += common.encodeURIParameters({
        ADT: 1,
        CHD: 0,
        DateIn: "",
        DateOut: inputDate(departureDate),
        Destination: arrivalStation,
        Disc: 0,
        INF: 0,
        Origin: departureStation,
        RoundTrip: false,
        TEEN: 0,
        FlexDaysIn: 2,
        FlexDaysBeforeIn: 2,
        FlexDaysOut: 2,
        FlexDaysBeforeOut: 2,
        ToUs: "AGREED",
        IncludeConnectingFlights: false
    })
    axios.get(URL).then(response => {
      callback(response.data)
    }).catch(err => console.log(err))
}

module.exports = {
    airportMeta,
    search
}
