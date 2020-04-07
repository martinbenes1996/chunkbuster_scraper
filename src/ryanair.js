'use strict'

const axios = require('axios')
const querystring = require("querystring");

const to_input_date = (dt) => {
    return dt.toISOString().slice(0,10)
}

const get_airport_meta = async (code) => {
    let URL = 'https://www.ryanair.com/api/locate/v1/autocomplete/airports?'
    URL += querystring.stringify({
        phrase: code,
        market: 'en-ie'
    })
    let response = await axios.get(URL)
    return response.data
}

const search = (departureStation, arrivalStation, departureDate, callback) => {
    return new Promise((resolve,reject) => {
        let URL = 'https://www.ryanair.com/api/booking/v4/en-ie/availability?'
        URL += querystring.stringify({
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
