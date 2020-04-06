
const db = require('./db')
const fetcher = require('./fetcher')


const updateAirports = async () => {
    console.log("Fetching data from OurAirports.com...")
    fetcher.airports_from_ourairports().then(result => {
        console.log("Updating airports in MongoDB...")
        db.updateAirports(result)
    })
}



module.exports = {
    updateAirports: updateAirports
}