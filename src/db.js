
var MongoClient = require('mongodb').MongoClient


var URL = process.env.DATABASE_URL
var db_name = "db"

var companies_collectionname = "companies"
var flights_collectionname = "flights"

const addCompany = async (company, callback=res=>res) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let existing = await findCompany(company.id)
    if(existing) {
        console.error("Given company_id already exists!")
        return callback(false)
    }
    await db.collection(companies_collectionname).insertOne(company)
    client.close()
    // ---
    return callback(true)
}
const findCompany = async (company_id, callback=res=>res) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({id: company_id}).toArray()
    client.close()
    // ---
    if(!result.length)
        return callback(undefined)
    return callback(result)
}
const listCompanies = async (callback=res=>res) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(companies_collectionname).find({}).toArray()
    client.close()
    // ---
    return callback(result)
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
const findFlight = async (flight_number, datetime, callback=res=>res) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({flight_number, datetime}).toArray()
    client.close()
    // ---
    if(!result.length)
        return callback(undefined)
    return callback(result)
}
const listFlights = async (callback=res=>res) => {
    // --- connect
    let client = await MongoClient.connect(URL)
    let db = client.db(db_name)
    let result = await db.collection(flights_collectionname).find({}).toArray()
    client.close()
    // ---
    return callback(result)
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
    // add other collections
    // ...

    client.close()
    // ---
}

module.exports = {
    init, // initializer
    addCompany, findCompany, listCompanies, // companies
    addFlight, findCompany, listFlights, // flights
}


