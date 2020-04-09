'use strict'

const axios = require('axios')
const querystring = require('querystring')

const db = require('./db')
const fetcher = require('./fetcher')

var url_api = undefined

const inputDate = (dt) => {
    return dt.toISOString().slice(0,10)
}
const update_API_version = async () => {
  let URL = 'https://wizzair.com/buildnumber'
  let response = await axios.get(URL)
  url_api = response.data.match(/https:\/\/be.wizzair.com\/[0-9]+\.[0-9]+\.[0-9]+/)[0]
  return url_api
}

const dates = async (departureStation, arrivalStation, from, to) => {
  console.log(`dates(${departureStation},${arrivalStation},${inputDate(from)},${inputDate(to)})`)
  if(!url_api) url_api = await update_API_version()
  let URL = url_api + '/Api/search/flightDates?'
  URL += querystring.stringify({
    departureStation,
    arrivalStation,
    from: inputDate(from),
    to: inputDate(to)
  })
  let response
  try {
    response = await axios.get(URL)
  } catch(err) {
    console.error("dates() error")
    if(err.response.status == 404) {
      return []
    }
    else {
      console.error(err.response.data)
      return undefined
    }
  }
  return response.data.flightDates
}

const airports = async () => {
  if(!url_api) url_api = await update_API_version()
  
  let URL = url_api + '/Api/asset/map?languageCode=en-gb'
  let body
  try {
    body = await axios.get(URL)
  } catch(err) {
    console.log(err)
    console.error(err.response.data)
    return []
  }

  let cities = body.data.cities.map(c => {
    return {
      iata_code: c.iata,
      name: c.shortName,
      latitude: c.latitude,
      longitude: c.longitude,
      currency: c.currencyCode,
      country: c.countryCode,
      country_name: c.countryName,
      connections: c.connections.map(conn => {
        return {
          company_id: "wizzair",
          iata_code: conn.iata,
          domestic: conn.isDomestic,
          new: conn.isNew
        }
      })
    }
  })
  return cities
}

const search = async (departureStation, arrivalStation, departureDate) => {
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
  if(!url_api) url_api = await update_API_version()
  let URL = url_api + '/Api/search/search?'
  let response = await axios.post(URL, payload)
  console.log("Request received")
  let flights = []
  for(let fl_idx in response.data.outboundFlights) {
    let fl = response.data.outboundFlights[fl_idx]
    let flight = {
      flight_number: fl.flightNumber,
      carrier_code: fl.carrierCode,
      departure_station: fl.departureStation,
      arrival_station: fl.arrivalStation,
      departure_datetime: new Date(Date.parse(fl.departureDateTime)),
      arrival_datetime: new Date(Date.parse(fl.arrivalDateTime)),
      fares: {}
    }
    for(let fare in fl.fares) {
      let total = fl.fares[fare].flightPriceDetail.total
      let total_eur = await fetcher.convert_currency(total.amount, total.currencyCode, "EUR")
      if(fl.fares[fare].bundle == "plus") {
        if(fl.fares[fare].wdc) flight.fares.class1_member = total_eur
        else flight.fares.class1 = total_eur
      } else if(fl.fares[fare].bundle == "middle") {
        if(fl.fares[fare].wdc) flight.fares.class2_member = total_eur
        else flight.fares.class2 = total_eur
      } else if(fl.fares[fare].bundle == "basic") {
        if(fl.fares[fare].wdc) flight.fares.basic_member = total_eur
        else flight.fares.basic = total_eur
      }
    }
    flights.push(flight)
  }
  return flights
}

module.exports = {
  airports: airports,
  dates: dates,
  search: search,
}
