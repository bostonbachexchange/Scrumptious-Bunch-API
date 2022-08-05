// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Service = require('../models/service')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /services
// this route will NOT require authentication
router.get('/services', (req, res, next) => {
	Service.find()
		.then((services) => {
			// `services` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return services.map((service) => service.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((services) => res.status(200).json({ services: services }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

////////////
// SHOW
////////////
//  will not require authentication
// GET SPECIFIC USER / FREELANCER SERVICES
router.get('/services/freelancer/:userId', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	// will we also need to get all services with them as owner?
	const userId = req.params.userId
	let freelancerArray = [];
	User.findById(userId)
		.then(handle404)
		// this will make it so that the user is always at freelancerArray[0]
		.then((user) => freelancerArray.push(user))
		.catch(err => console.log(err))
	Service.find( {owner: userId})
		.then(handle404)
		.then((services) => {
			freelancerArray.push(services)
			res.status(200).json({ services: freelancerArray })
		})
		.catch(next)
})
///

// SHOW
// GET /services/5a7db6c74d55bc51bdf39793
// also will not require authentication
router.get('/services/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Service.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((service) => res.status(200).json({ service: service.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /services
// this WILL require authentication
router.post('/services', requireToken, (req, res, next) => {
	// set owner of new service to be current user
	req.body.service.owner = req.user._id

	Service.create(req.body.service)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((service) => {
			res.status(201).json({ service: service.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /services/5a7db6c74d55bc51bdf39793
router.patch('/services/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.service.owner

	Service.findById(req.params.id)
		.then(handle404)
		.then((service) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, service)

			// pass the result of Mongoose's `.update` to the next `.then`
			return service.updateOne(req.body.service)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})



// DESTROY
// DELETE /services/5a7db6c74d55bc51bdf39793
router.delete('/services/:id', requireToken, (req, res, next) => {
	Service.findById(req.params.id)
		.then(handle404)
		.then((service) => {
			// throw an error if current user doesn't own `example`
			requireOwnership(req, service)
			// delete the example ONLY IF the above didn't throw
			service.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
