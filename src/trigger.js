
const db = require('./db')
const fetcher = require('./fetcher')

const update_airports = async () => {
    console.log("Fetching data from OurAirports.com...")
    fetcher.airports_from_ourairports().then(result => {
        console.log("Updating airports in MongoDB...")
        db.update_airports(result)
    })
}

module.exports = {
    update_airports: update_airports
}