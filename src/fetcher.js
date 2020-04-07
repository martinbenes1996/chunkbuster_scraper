
const axios = require('axios')
const csv = require('csvtojson')

const airports_from_ourairports = async () => {
    let response = await axios.get('https://ourairports.com/data/airports.csv')
    let jsonObj = await csv().fromString(response.data)
    let airports = jsonObj.filter(airport => {return airport.iata_code != ""})
    return airports
}

const convert_currency = async (value, from, to) => {
    if(from === to) return value
    let URL = `https://api.exchangeratesapi.io/latest?base=${from}`
    let response
    try {
        response = await axios.get(URL)
    } catch(err) {
        throw new Error(err.response.data.error)
    }
    if(!(to in response.data.rates))
        throw new Error("Base '"+to+"' is not supported.")
    let result = value * response.data.rates[to]
    return result
}

module.exports = {
    airports_from_ourairports: airports_from_ourairports,
    convert_currency: convert_currency
}
