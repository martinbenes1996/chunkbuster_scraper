'use strict'

const wizzair = require('./wizzair')






wizzair.dates('NYO','VIE',new Date('2020-05-02'),new Date('2020-07-02'), data => console.log(data))

wizzair.search('NYO','VIE',new Date('2020-05-02'), data => console.log(data))

