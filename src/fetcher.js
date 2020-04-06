
const axios = require('axios')
const csv = require('csvtojson')

const airports_from_ourairports = async () => {
    return new Promise((resolve,reject) => {
        axios.get('https://ourairports.com/data/airports.csv').then(response => {
            csv()
            .fromString(response.data)
            .then(jsonObj => {
                let airports_selection = jsonObj.filter(airport => {return airport.iata_code != ""})
                resolve(airports_selection)
            })
        })
    })
}

var base_url = 'https://api.exchangeratesapi.io/latest'
const convert_currency = async (value, from, to) => {
    return new Promise((resolve, reject) => {
        let URL = base_url + `?base=${from}`
        axios.get(URL).then(response => {
            let result = value * response.data.rates[to]
            resolve(result)
        })
    })
}

module.exports = {
    airports_from_ourairports: airports_from_ourairports,
    convert_currency: convert_currency
}
