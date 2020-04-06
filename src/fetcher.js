
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

module.exports = {
    airports_from_ourairports: airports_from_ourairports
}
