'use strict'


const wizzair = require('./wizzair')
const db = require('./db')
//const ryanair = require('./ryanair')

//wizzair.dates('NYO','VIE',new Date('2020-05-02'),new Date('2020-07-02'), data => console.log(data))

//ryanair.airportMeta('NYO', data => console.log(data))
//ryanair.search('NYO','VIE',new Date('2020-05-15'), data => console.log(data))


const update_flight = async () => {
    let flight_date = new Date('2020-05-31')
    let flights = await wizzair.search('NYO','TZL',flight_date)
    console.log("Flights received.")
    console.log(flights)
    for(let flight in flights) {
        await db.update_flight(flights[flight])
        console.log("Flight added.")
    }
    console.log("finding flight")
    let result_flights = await db.find_flight('4282',flight_date)
    console.log(result_flights[0].records)
}
update_flight()
//wizzair.update_API_version()

/*
const convertCurrency = async () => {
    fetcher.convert_currency(109, "SEK", "EUR", value => console.log(value))
}*/

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

/*
const getAirport = async () => {
    let vienna = await db.findAirport("VIE")
    console.log(vienna)
}
*/


//const updater = require('./updater')
//updater.updateAirports()
//getAirport()

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
