/* global describe it beforeEach afterEach */

const axios = require('axios')
const sandbox = require('sinon').createSandbox()
const chai = require('chai')

const expect = chai.expect

const oneMinuteInMilliseconds = 60000

describe('exchangeRate', () => {
  let res
  const req = {}
  const data = {
    rates: {
      AED: 3.672538,
      AFN: 66.809999
    }
  }

  beforeEach(() => {
    res = {}
    res.status = sandbox.stub().returns(res)
    res.json = sandbox.stub().returns(res)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getExchangeRates', () => {
    it('should use the cache if the next data update time is in the future', async () => {
      data.time_next_update_unix = Math.floor((Date.now() + oneMinuteInMilliseconds) / 1000)
      const openExchangeRatesStub = sandbox.stub(axios, 'get').resolves({ data })

      // have to remove the script and then include again in order to clear cache set by any previous tests
      delete require.cache[require.resolve('../../controllers/exchangeRate')]
      const { getExchangeRates } = require('../../controllers/exchangeRate')

      // primer to set the cache
      const { rates } = await getExchangeRates(req, res)
      console.log(rates)

      // call to retrieve from cache
      await getExchangeRates(req, res)

      // check getOpenExchangeRates number of calls, should be 1
      expect(openExchangeRatesStub.callCount).to.equal(1)
    })
    it('should not use the cache if the next data update time is in the past', async () => {
      data.time_next_update_unix = Math.floor((Date.now() - oneMinuteInMilliseconds) / 1000)
      const openExchangeRatesStub = sandbox.stub(axios, 'get').resolves({ data })

      // have to remove the script and then include again in order to clear cache set by any previous tests
      delete require.cache[require.resolve('../../controllers/exchangeRate')]
      const { getExchangeRates } = require('../../controllers/exchangeRate')

      // primer to set the cache
      await getExchangeRates(req, res)

      // call to retrieve from service
      await getExchangeRates(req, res)

      // check getOpenExchangeRates number of calls, should be 2
      expect(openExchangeRatesStub.callCount).to.equal(2)
    })
  })
})
