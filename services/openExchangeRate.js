const axios = require('axios')
const { openExchangeRateUrl } = require('../common/config')

const getOpenExchangeRates = async () => {
  return await axios.get(openExchangeRateUrl)
}

module.exports = {
  getOpenExchangeRates
}
