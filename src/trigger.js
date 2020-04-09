
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
    let airports = await wizzair.airports()
    await db.update_connections("wizzair", airports).catch(err => {
        console.error("Update of connections failed.")
        console.error(err)
    })
    // go airport by airport
    let now = new Date()
    for(let i in airports) {
        let airport = airports[i]
        for(let j in airport.connections) {
            let connection = airport.connections[j]
            // stations
            let dep = airport.iata_code
            let arr = connection.iata_code
            // fetch dates of flights <now, now+2mon>
            let startdate = new Date(now.getTime())
            let enddate = new Date(now.getTime())
            enddate.setMonth(enddate.getMonth() + 2)
            // fetch flight dates
            let dates = await wizzair.dates(dep, arr, startdate, enddate)
            // go date by date
            for(let d in dates) {
                let flightdate = new Date(Date.parse(dates[d]))
                // fetch prices
                let flights = await wizzair.search(dep,arr,flightdate)
                console.log(flights)
                // store in database
                for(let f in flights) {
                    let flight = flights[f]
                    await db.update_flight(flight)
                }
                
                // ... // TODO
                await new Promise(r => setTimeout(r,1500))
            }
            
        }
    }
    
        
        
}

module.exports = {
    update_airports: update_airports,
    update_wizzair: update_wizzair
}