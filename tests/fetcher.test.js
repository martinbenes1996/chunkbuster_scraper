
// testing framework
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised)
var expect = chai.expect
// tested unit
const fetcher = require('../src/fetcher')

describe('fetcher.convert_currency', () => {
    it('should support euros, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(100, "EUR","EUR")
        ).to.be.a('number'
        ).that.equals(100)
    })
    it('should support US dollars, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(200, "USD", "USD")
        ).to.be.a('number'
        ).that.equals(200)
    })
    it('should support GB pounds, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(300, "GBP", "GBP")
        ).to.be.a('number'
        ).that.equals(300)
    })
    it('should support PL zloty, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(500, "PLN", "PLN")
        ).to.be.a('number'
        ).that.equals(500)
    })
    it('should support CZ koruna, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(2000, "CZK", "CZK")
        ).to.be.a('number'
        ).that.equals(2000)
    })
    it('should support HU forint, returns the same value', async () => {
        expect(
            await fetcher.convert_currency(15000, "HUF", "HUF")
        ).to.be.a('number'
        ).that.equals(15000)
    })
    it('should throw on unsupported currency (from)', async () => {
        await expect(
            fetcher.convert_currency(15000, "CSK", "PLN")
        ).to.eventually.be.rejected;
    })
    it('should throw on unsupported currency (to)', async () => {
        let error_to = () => fetcher.convert_currency(3000, "CZK", "PLM")
        expect(
            fetcher.convert_currency(3000, "CZK", "PLM")
        ).to.be.rejected
    })
})
