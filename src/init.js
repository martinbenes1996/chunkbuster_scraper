'use strict'


const wizzair = require('./wizzair')
const db = require('./db')
const ryanair = require('./ryanair')
const trigger = require('./trigger')

//trigger.update_airports()
//trigger.update_wizzair().catch(err => console.error(err))

/*
const main = async () => {
    await db.init()
    await db.add_company({'id': 'ryanair', 'name': 'Ryanair'})
    await db.add_company({'id': 'wizzair', 'name': 'Wizz Air'})
    await db.list_companies((result) => console.log(result))
    //let dates = await wizzair.dates("NYO","TZL",new Date("2020-05-05"),new Date("2020-07-01"))
    //console.log(dates)
    await update_flight()
}
*/


const get_airport = async () => {
    let airport = await db.find_airport("NYO")
    console.log(airport)
}
//get_airport()

const get_flights = async () => {
    let flights = await db.list_flights()
    console.log(flights[0].records)
}
get_flights()

module.exports = {
    trigger: require('./trigger'),
    // database
    mongodb: require('./db'),
    // aircompanies
    wizzair: require('./wizzair'),
    ryanair: require('./ryanair'),
    // other
    fetcher: require('./fetcher'),
}
