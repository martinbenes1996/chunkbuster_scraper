
const db = require('./db')
const fetcher = require('./fetcher')
const wizzair = require('./wizzair')

const update_airports = async () => {
    console.log("Fetching data from OurAirports.com...")
    let result = await fetcher.airports_from_ourairports()
    console.log(`Received ${result.length} airports.`)
    console.log("Updating airports in MongoDB...")
    try {
        await db.update_airports(result)
    } catch(err) {
        console.error(err)
    }
}


const update_wizzair = async () => {
    console.log("Fetching data from WizzAir.com...")
    // update airports
    let airport_connections = await wizzair.airports()
    await db.update_connections("wizzair", airport_connections)
    // go airport by airport
    for(let i in airports) {
        let airport = airports[i]
        for(let j in airport.connections) {
            let connection = aiport.connections[j]
            // fetch dates of flights
            // go date by date
                // fetch price
                // store in database
        }
    }
    
        
        
}

module.exports = {
    update_airports: update_airports,
    update_wizzair: update_wizzair
}