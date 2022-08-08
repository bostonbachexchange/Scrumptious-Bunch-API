const express = require('express')
const passport = require('passport')

// pull in Mongoose model for pets
const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// ROUTES GO HERE

// POST -> create a profile
// POST /profile/<user_id>
router.post('/profile/:userId', requireToken, removeBlanks, (req, res, next) => {
    // get our profile from req.body
    const prof = req.body.profile
    // get our pet's id from req.params.petId
    const userId = req.params.userId
    // find the pet
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // set the profile as the user's profile
            user.profile = prof
            // save the user
            return user.save()
        })
        // send the newly updated pet as json
        .then(user => res.status(201).json({ user: user }))
        .catch(next)
})

// UPDATE a Profile
// PATCH /updateProfile
router.patch('/updateProfile', requireToken, removeBlanks, (req, res, next) => {
    // get the user and the profile ids saved to variables
    const userId = req.user.id
    // const profileId = req.params.profileId

    // find our user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // make sure the user sending the request is the owner
            const profile = user.profile
            profile.set(req.body.profile)
            console.log('user.profile', profile)
            // return the saved profile
            return user.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// SHOW
// GET /profile/<user_id>
router.get('/profile/:userId', (req, res, next) => {
    const userId = req.params.userId;
    let profile
	// req.params.id will be set based on the `:userId` in the route
	User.findById(userId)
		.then(handle404)
        .then((user) => {
            profile = user.profile
            console.log('here is the user \n', user)
            console.log('here is profile \n', profile)
            return profile
        })
		// if `findById` is succesful, respond with 200 and "profile" JSON
        .then((profile) => res.status(200).json({ profile: profile.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// // DELETE a Profile
// // DELETE /profile
router.delete('/profile', requireToken, (req, res, next) => {
    // we are getting the profile of associated user and removing it, a user can only ever access their profile with this pattern (require ownership is redundant)
    // get the user and the profile ids saved to variables
    const userId = req.user.id
    User.findById(userId)
        // returns user object of user that made the request
        .then(handle404)
        // do stuff with the toy(in this case, delete it)
        .then(user => {
            // we know that this is the user object from find by id
            console.log('here is the user: \n', user)
            console.log('here is the profile: \n', user.profile)

            // we can get the subdoc the same way as update
            const theProfile = user.profile
            // call remove on the subdoc
            theProfile.remove()
            console.log('user without profile?', user)
            // return the saved user
            return user.save()
        })
        // send 204 no content status
        .then(() => res.sendStatus(204))
        // handle errors
        .catch(next)
})

// export the router
module.exports = router