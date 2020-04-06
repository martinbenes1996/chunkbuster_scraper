'use strict'

const axios = require('axios')

const common = require('./common')
const db = require('./db')
const fetcher = require('./fetcher')

var url_api = undefined

const inputDate = (dt) => {
    return dt.toISOString().slice(0,10)
}
const update_API_version = () => {
  return new Promise((resolve, reject) => {
    let URL = 'https://wizzair.com/buildnumber'
    axios.get(URL).then(response => {
      url_api = response.data.match(/https:\/\/be.wizzair.com\/[0-9]+\.[0-9]+\.[0-9]+/)[0]
      console.log(url_api)
      return url_api
    })
  })
}

const dates = async (departureStation, arrivalStation, from, to) => {
  if(!url_api) {
    url_api = await update_API_version()
  }
  let URL = url_api + '/Api/search/flightDates?'
  URL += common.encodeURIParameters({
    departureStation,
    arrivalStation,
    from: inputDate(from),
    to: inputDate(to)
  })
  let response = await axios.get(URL).data
  if(response.response.status == 200) {
    return response.response.data
  }
  else if(response.response.status == 404) {
    return []
  }
  else {
    console.err(response.response.data)
    return undefined
  }
    
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
    
    let URL = 'https://be.wizzair.com/10.18.0/Api/search/search'
    axios.post(URL, payload).then((response) => {
      console.log("Request received")
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
        
        const parse_fares = async (fares) => {
          let result = {}
          return new Promise(async (resolveParseFares,rejectParseFares) => {
            for(let fare in fares) {
              let total = fares[fare].flightPriceDetail.total
              let total_eur = await fetcher.convert_currency(total.amount, total.currencyCode, "EUR")
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
          parse_fares(fl.fares).then(fares => {
            flight.fares = fares
            // add to flights
            flights.push(flight)
          }).catch(err => {
            console.error(err)
          })
        )
      })
      Promise.all(promises).then(() => {
        resolve(flights)
      })
    }).catch(err => {
      console.error(err)
      // no flights of given input
      if(err.response.status == 404)
        return resolve([])
      // WizzAir updated API
      if(err.response.status == 503) {
        console.log("trigger WizzAir API check")
      }

      else // other error
        reject(err.response)
    })
  })
}

module.exports = {
  update_API_version,
    dates,
    search
}
