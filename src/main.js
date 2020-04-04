'use strict'

const wizzair = require('./wizzair')
const ryanair = require('./ryanair')





//wizzair.dates('NYO','VIE',new Date('2020-05-02'),new Date('2020-07-02'), data => console.log(data))

//wizzair.search('NYO','VIE',new Date('2020-05-02'), data => console.log(data))


//ryanair.airportMeta('NYO', data => console.log(data))
ryanair.search('NYO','VIE',new Date('2020-05-15'), data => console.log(data))
