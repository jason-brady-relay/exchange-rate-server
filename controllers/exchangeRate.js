const { getOpenExchangeRates } = require('../services/openExchangeRate')

const NodeCache = require('node-cache')
const nodeCache = new NodeCache()

// ExchangeRate-API The data only refreshes once every 24 hours anyway.
// Included in the API response is the specific time of the next data update in Epoch time_next_update_unix
// The node cache will cache that time and refresh if a request comes in after that time
const shouldUseCache = () => {
  const currentEpochTime = Math.floor(Date.now() / 1000) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#get_the_number_of_seconds_since_the_ecmascript_epoch
  const timeNextUpdateUnix = nodeCache.get('time_next_update_unix')
  return timeNextUpdateUnix && currentEpochTime < timeNextUpdateUnix
}

const getExchangeRates = async (req, res) => {
  try {
    if (shouldUseCache()) {
      console.log('using cached rates')
      const rates = nodeCache.get('rates')
      return res.status(200).json({ rates })
    }

    const { data } = await getOpenExchangeRates()
    const { rates, time_next_update_unix } = data // eslint-disable-line

    console.log('caching rates')
    nodeCache.set('rates', rates)

    console.log('caching time next update unix', time_next_update_unix)
    nodeCache.set('time_next_update_unix', time_next_update_unix)

    return res.status(200).json({ rates })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'unable to get exchange rates' })
  }
}

module.exports = {
  getExchangeRates
}
