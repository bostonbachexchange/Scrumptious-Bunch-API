const express = require('express')
const passport = require('passport')

// pull in Mongoose model for pets
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// ROUTES GO HERE
// we only need three, and we want to set them up using the same conventions as our other routes, which means we might need to refer to those other files to make sure we're using our middleware correctly

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
            // console.log('this is the user', user)
            // console.log('this is prof', prof)
            // set the profile as the user's profile
            user.profile = prof
            // console.log('this is the new user.profile', user.profile)
            // save the user
            return user.save()
        })
        // send the newly updated pet as json
        .then(user => res.status(201).json({ user: user }))
        .catch(next)
})

// UPDATE a Profile
// PATCH /profiles/<user_id>/<profile_id>
router.patch('/updateprofile/:userId/', requireToken, removeBlanks, (req, res, next) => {
// router.patch('/profile/:userId/:profileId', requireToken, removeBlanks, (req, res, next) => {
    // get the user and the profile ids saved to variables
    const userId = req.params.userId
    // const profileId = req.params.profileId

    // find our user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // single out the profile (.id is a subdoc method to find something in an array of subdocs)
            // console.log(user.profile._id)
            // const theProfile = user.profile[0]._id
            // console.log(theProfile)
            // make sure the user sending the request is the owner
            // requireOwnership(req, user)
            user.profile = req.body.profile
            console.log('user.profile', user.profile)
            // update the profile with a subdocument method
            // theProfile.set(req.body.profile)
            // return the saved pet
            return user.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// SHOW
// GET /profile/5a7db6c74d55bc51bdf39793
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
// // DELETE /profiles/<user_id>/<profile_id>
router.delete('/profile/:userId/:profileId', requireToken, (req, res, next) => {
// router.delete('/profile/:userId/:profileId', requireToken, (req, res, next) => {
    // get the user and the profile ids saved to variables
    const userId = req.params.userId
    // const profileId = req.params.profileId
    // then we find the pet
    User.findById(userId)
        // handle a 404
        .then(handle404)
        // do stuff with the toy(in this case, delete it)
        .then(user => {
            console.log('here is the user: \n', user)
            console.log('here is the profile: \n', user.profile)
            // we can get the subdoc the same way as update
            const theProfile = user.profile
            // const theProfile = user.profile.id(profileId)
            console.log('here is theProfile', theProfile)
            // require that the user deleting this toy is the user's owner
            // requireOwnership(req, user)
            // call remove on the subdoc
            theProfile.remove()
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