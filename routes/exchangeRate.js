const { getExchangeRates } = require('../controllers/exchangeRate')
const express = require('express')
const router = express.Router()

router.get('/rates', getExchangeRates)

module.exports = router
