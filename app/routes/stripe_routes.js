// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const User = require('../models/user')
// pull in Mongoose model for examples
const Service = require('../models/service')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const { json } = require('express')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

const stripe = require('stripe')('sk_test_51LTRITK06RXOssaSljCv8UTj4c8LJDNbb2oiLDCS9UNPpcZNSmDL1B07J0WHxoxMizNV4sztNFy9JeOjv8yKnrNi00xH6wracw')
const cors = require('cors')
const bodyParser= require('body-parser')
require("dotenv").config()
// app.use(bodyParser.json())
router.use(cors())

router.post('/payment', cors(), async (req, res) => {
    let { amount, id } = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            description: req.body.description,
            payment_method: id,
            confirm: true
        })
        console.log('Payment', payment)
        res.json({
            message: "Payment was successful.",
            success: true
        })
    } catch (error) {
        console.log('Error: ', error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

module.exports = router
