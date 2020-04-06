'use strict'

const axios = require('axios')

const common = require('./common')

const to_input_date = (dt) => {
    return dt.toISOString().slice(0,10)
}

const get_airport_meta = (code) => {
    return new Promise((resolve,reject) => {
        let URL = 'https://www.ryanair.com/api/locate/v1/autocomplete/airports?'
        URL += common.encodeURIParameters({
            phrase: code,
            market: 'en-ie'
        })
        axios(URL).then(response => {
            resolve(response.data)
        }).catch(err => {
            console.err(err.response)
            reject(undefined)
        }) 
    })
    
}

const search = (departureStation, arrivalStation, departureDate, callback) => {
    return new Promise((resolve,reject) => {
        let URL = 'https://www.ryanair.com/api/booking/v4/en-ie/availability?'
        URL += common.encodeURIParameters({
            ADT: 1,
            CHD: 0,
            DateIn: "",
            DateOut: to_input_date(departureDate),
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
            resolve(response.data)
        }).catch(err => {
            console.log(err.response)
            reject(undefined)
        })
    })
}

module.exports = {
    // RyanAir
    get_airport_meta: get_airport_meta,
    search: search
}
