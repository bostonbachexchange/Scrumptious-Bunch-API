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
router.post('/profiles/:userId', requireToken, removeBlanks, (req, res, next) => {
    // get our profile from req.body
    const profile = req.body.profile
    // get our pet's id from req.params.petId
    const userId = req.params.userId
    // find the pet
    User.findById(userId)
        .then(handle404)
        .then(user => {
            console.log('this is the user', user)
            console.log('this is the profile', profile)

            // push the profile into the user's profiles array
            user.profile.push(profile)

            // save the user
            return user.save()
            
        })
        // send the newly updated pet as json
        .then(profile => res.status(201).json({ profile: profile }))
        .catch(next)
})

// UPDATE a Profile
// PATCH /profiles/<user_id>/<profile_id>
router.patch('/profile/:profileId/:profileId', requireToken, removeBlanks, (req, res, next) => {
    // get the toy and the pet ids saved to variables
    const userId = req.params.userId
    const profileId = req.params.profileId

    // find our user
    User.findById(userId)
        .then(handle404)
        .then(user => {
            // single out the toy (.id is a subdoc method to find something in an array of subdocs)
            const theProfile = user.profiles.id(profileId)
            // make sure the user sending the request is the owner
            requireOwnership(req, user)
            // update the toy with a subdocument method
            theProfile.set(req.body.profile)
            // return the saved pet
            return profile.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE a Profile
// DELETE /profiles/<profile_id>/<profile_id>
router.delete('/profiles/:userId/:profileId', requireToken, (req, res, next) => {
    // get the toy and the pet ids saved to variables
    const userId = req.params.userId
    const profileId = req.params.profileId
    // then we find the pet
    Use.findById(userId)
        // handle a 404
        .then(handle404)
        // do stuff with the toy(in this case, delete it)
        .then(user => {
            // we can get the subdoc the same way as update
            const theProfile = user.profiles.id(profileId)
            // require that the user deleting this toy is the user's owner
            requireOwnership(req, user)
            // call remove on the subdoc
            theToy.remove()

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