
var MongoClient = require('mongodb').MongoClient

var URL = process.env.DATABASE_URL
var db_name = "db"

var companies_collectionname = "companies"
var flights_collectionname = "flights"
var airports_collectionname = "airports"

const addCompany = async (company) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let existing = await findCompany(company.id)
    if(existing) {
        console.error("Given company_id already exists!")
        return false
    }
    await db.collection(companies_collectionname).insertOne(company)
    client.close()
    // ---
    return true
}
const findCompany = async (company_id) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({id: company_id}).toArray()
    client.close()
    // ---
    if(!result.length)
        return undefined
    return result
}
const listCompanies = async () => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({}).toArray()
    client.close()
    // ---
    return result
}
const listCompanyAirports = async (company_id) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = "TODO" // ...
    client.close()
    // ---
    // ...
    return result
}

const addFlight = async (flight) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let existing = await findFlight(flight.flight_number, flight.datetime) 
    if(existing) {
        console.error("Given flight already exists!")
        return false
    }
    await db.collection(flights_collectionname).insertOne(flight)
    await client.close()
    // ---
    return true
}
const findFlight = async (flight_number, datetime) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({flight_number, datetime}).toArray()
    client.close()
    // ---
    if(!result.length)
        return undefined
    return result
}
const listFlights = async () => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({}).toArray()
    client.close()
    // ---
    return result
}
const findAirport = async (iata_code) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(airports_collectionname).find({iata_code: iata_code}).toArray()
    client.close()
    // ---
    if(!result.length) return undefined
    return result[0]
}
const updateAirports = async (airports) => {
    let promises = []
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    for(let i in airports) {
        let airport = airports[i]
        let dbpromise = db.collection(airports_collectionname).updateOne({iata_code: airport.iata_code}, {$set: airport}, {upsert: true})
        promises.push(dbpromise)
    }
    Promise.all(promises).then(() => {client.close(); console.log("Airports updated.")})
    // ---
}

const init = async () => {
    // --- connect
    let client = await MongoClient.connect(URL + db_name)
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
}

module.exports = {
    init, // initializer
    addCompany, findCompany, listCompanies, listCompanyAirports, // companies
    addFlight, findCompany, listFlights, // flights
    findAirport, updateAirports, // airports
}


