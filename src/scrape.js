
const axios = require('axios')
const cheerio = require('cheerio')
var iconv = require('iconv-lite');

/*
axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html, { decodeEntities: false });
    let mainHeader = $('.opener').find('h3').html()
    console.log(mainHeader)
    let mainHeaderUtf8 = iconv.decode(mainHeader, 'windows-1250')
    console.log(mainHeaderUtf8)
    
  })
  .catch(console.error);
*/
