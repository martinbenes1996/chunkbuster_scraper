'use strict'

const wizzair = require('./wizzair')
const ryanair = require('./ryanair')

const db = require('./db')
const currency = require('./currency')

//wizzair.dates('NYO','VIE',new Date('2020-05-02'),new Date('2020-07-02'), data => console.log(data))

//ryanair.airportMeta('NYO', data => console.log(data))
//ryanair.search('NYO','VIE',new Date('2020-05-15'), data => console.log(data))

const updateFlight = async () => {
    let flights = await wizzair.search('NYO','VIE',new Date('2020-05-02'))
    console.log("Flights received.")
    console.log(flights)
    for(let flight in flights) {
        let status = await db.addFlight(flights[flight])
        console.log("Flight added.")
        console.log(status)
    }
    
}

const convertCurrency = async () => {
    currency.convert(109, "SEK", "EUR", value => console.log(value))
}

const main = async () => {
    await db.init()
    await db.addCompany({'id': 'ryanair', 'name': 'Ryanair'})
    await db.addCompany({'id': 'wizzair', 'name': 'Wizz Air'})
    await db.listCompanies((result) => console.log(result))
    await updateFlight()
}

main()
