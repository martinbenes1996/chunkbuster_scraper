'use strict'

const axios = require('axios')
const common = require('./common')
const currency = require('./currency')

const inputDate = (dt) => {
    return dt.toISOString().slice(0,10)
}

const dates = (departureStation, arrivalStation, from, to) => {
  return new Promise((resolve,reject) => {
    let URL = 'https://be.wizzair.com/10.17.1/Api/search/flightDates?'
    URL += common.encodeURIParameters({
      departureStation,
      arrivalStation,
      from: inputDate(from),
      to: inputDate(to)
    })
    axios(URL).then(response => {
      resolve(response.data)
    }).catch(err => {
      if(err.response.status == 404)
      reject([])
    })
  })
    
}

const search = (departureStation, arrivalStation, departureDate) => {
  return new Promise((resolve,reject) => {
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
    axios.post(URL, payload).then((response) => {
      let flights = [], promises = []
      response.data.outboundFlights.forEach(fl => {
        let flight = {
          flight_number: fl.flightNumber,
          carrier_code: fl.carrierCode,
          departure_station: fl.departureStation,
          arrival_station: fl.arrivalStation,
          departure_datetime: fl.departureDateTime,
          arrival_datetime: fl.arrivalDateTime
        }
        
        const parseFares = async (fares) => {
          let result = {}
          return new Promise(async (resolveParseFares,rejectParseFares) => {
            for(let fare in fares) {
              let total = fares[fare].flightPriceDetail.total
              let total_eur = await currency.convert(total.amount, total.currencyCode, "EUR")
              if(fares[fare].bundle == "plus") {
                if(fares[fare].wdc) result.class1_member = total_eur
                else result.class1 = total_eur
              } else if(fares[fare].bundle == "middle") {
                if(fares[fare].wdc) result.class2_member = total_eur
                else result.class2 = total_eur
              } else if(fares[fare].bundle == "basic") {
                if(fares[fare].wdc) result.basic_member = total_eur
                else result.basic = total_eur
              }
            }
            resolveParseFares(result)
          })
        }

        promises.push(
          parseFares(fl.fares).then(fares => {
            flight.fares = fares
            // add to flights
            flights.push(flight)
          })
        )
      })
      Promise.all(promises).then(() => {
        resolve(flights)
      })
    }).catch(err => {
      // no flights of given input
      if(err.response.status == 404)
        return resolve([])

      else // other error
        reject(err.response)
    })
  })
}

module.exports = {
    dates,
    search
}
