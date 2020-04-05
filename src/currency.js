'use strict'

const axios = require('axios')

var base_url = 'https://api.exchangeratesapi.io/latest'

const convert = async (value, from, to) => {
    return new Promise((resolve, reject) => {
        let URL = base_url + `?base=${from}`
        axios.get(URL).then(response => {
            let result = value * response.data.rates[to]
            resolve(result)
        })
    })
}

module.exports = {
    convert
}
