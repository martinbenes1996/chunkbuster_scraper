
var MongoClient = require('mongodb').MongoClient
var MongoTimestamp = require('mongodb').Timestamp

var URL = process.env.DATABASE_URL
var db_name = "db"

var companies_collectionname = "companies"
var flights_collectionname = "flights"
var airports_collectionname = "airports"

const add_company = async (company) => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let existing = await find_company(company.id)
    if(existing) {
        console.error("Given company_id already exists!")
        return false
    }
    await db.collection(companies_collectionname).insertOne(company)
    client.close()
    // ---
    return true
}
const find_company = async (company_id) => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({id: company_id}).toArray()
    client.close()
    // ---
    if(!result.length)
        return undefined
    return result
}
const list_companies = async () => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({}).toArray()
    client.close()
    // ---
    return result
}
const list_company_airports = async (company_id) => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = "TODO" // ...
    client.close()
    // ---
    // ...
    return result
}

const update_flight = async (flight) => {
    let record = {timestamp: new Date(Date.now()), fares: flight.fares}
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let existing = await find_flight(flight.flight_number, new Date(Date.parse(flight.departure_datetime))) 
    if(!existing) {
        delete flight.fares
        flight.records = [ record ]
        await db.collection(flights_collectionname).insertOne(flight)
    } else {
        let updater = {$push:{records: record}}
        await db.collection(flights_collectionname).updateOne({flight_number: flight.flight_number, datetime: flight.datetime}, updater)
    }
    await client.close()
    // ---
    console.log(`Flight ${flight.flight_number} updated.`)
    return true
}
const find_flight = async (flight_number, flight_date) => {
    let dt_end = new Date(flight_date)
    dt_end.setDate(flight_date.getDate() + 1)
    let datetime_condition = {$gte: flight_date, $lte: dt_end}
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({flight_number: flight_number, 
                                                                   departure_datetime: datetime_condition}).toArray()
    client.close()
    // ---
    if(!result.length)
        return undefined
    return result
}
const list_flights = async () => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({}).toArray()
    client.close()
    // ---
    return result
}
const find_airport = async (iata_code) => {
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    let result = await db.collection(airports_collectionname).find({iata_code}).toArray()
    await client.close()
    // ---
    if(!result.length) return {}
    return result[0]
}
const update_airports = async (airports) => {
    let promises = []
    // --- connect
    let client = await MongoClient.connect(URL, { useUnifiedTopology: true})
    let db = client.db(db_name)
    for(let i in airports) {
        let airport = airports[i]
        let old_airport = await find_airport(airport.iata_code)
        airport.connections = old_airport.connections || []
        let dbpromise = db.collection(airports_collectionname).updateOne({iata_code: airport.iata_code}, {$set: airport }, {upsert: true})
        promises.push(dbpromise)
    }
    await Promise.all(promises)
    
    client.close()
    // ---
    console.log("Airports updated.")
}

const list_connections = async (iata_code) => {
    // --- connect
    let client = await MongoClient.connect(URL, {useUnifiedTopology: true})
    let db = client.db(db_name)
    let airport = await db.collection(airports_collectionname).find(
            {iata_code}
        ).toArray()
    client.close()
    // ---
    return airport[0].connections
}
const find_connection = async (from, to) => {
    // --- connect
    let client = await MongoClient.connect(URL, {useUnifiedTopology: true})
    let db = client.db(db_name)
    let airports = await db.collection(airports_collectionname).find(
            {iata_code: from,"connections.iata_code": to}
        ).toArray()
    client.close()
    // ---
    if(!airports.length) return []
    let connections = airports[0].connections.filter(e => e.iata_code === to)
    //console.log(`find_airport_connection(${from},${to}) -> ${JSON.stringify(connections)}`)
    return connections
}
const update_connections = async (company_id, airports) => {
    let promises = []
    // --- connect
    let client = await MongoClient.connect(URL, {useUnifiedTopology: true})
    let db = client.db(db_name)
    for(let i in airports) {
        let airport = airports[i]
        for (let j in airport.connections) {
            let connection = airport.connections[j]
            let airport_connections = await find_connection(
                airport.iata_code,
                connection.iata_code
            )
            // update existing connection
            let connection_matches = e => e.company_id === company_id
            if(airport_connections.some(connection_matches)) {
                let promise = db.collection(airports_collectionname).
                    updateOne({
                            iata_code: airport.iata_code,
                            "connections.company_id": company_id,
                            "connections.iata_code": connection.iata_code
                        },
                        {$set: { "connections.$": connection} }
                    )
                promises.push(promise)
            // create new connection
            } else {
                let promise = db.collection(airports_collectionname).
                    updateOne(
                        {iata_code: airport.iata_code},
                        {$push: {connections: connection}}
                    )
                promises.push(promise)
            }
        }
    }
    await Promise.all(promises)
    
    client.close()
    // ---
    console.log(`Connections of ${company_id} updated.`)
}

const init = async () => {
    // --- connect
    let client = await MongoClient.connect(URL + db_name, { useUnifiedTopology: true})
    let db = client.db(db_name)
    
    try { // create collection "companies"
        await db.createCollection(companies_collectionname)
    } catch(err) { console.error(err) }
    try { // create collection "flights"
        await db.createCollection(flights_collectionname)
    } catch(err) { console.error(err) }
    try { // create collection "airports"
        await db.createCollection(airports_collectionname)
    } catch(err) { console.error(err) }
    // add other collections
    // ...

    client.close()
    // ---
    console.log("MongoDB database initialized.")
}
init()

module.exports = {
    // companies
    add_company: add_company,
    find_company: find_company,
    list_companies: list_companies,
    list_company_airports: list_company_airports,
    // flights
    update_flight: update_flight,
    find_flight: find_flight,
    list_flights: list_flights,
    // airports
    find_airport: find_airport,
    update_airports: update_airports,
    // connections
    find_connection: find_connection,
    list_connections: list_connections,
    update_connections: update_connections,
}


