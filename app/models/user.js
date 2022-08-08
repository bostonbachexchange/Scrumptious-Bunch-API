const mongoose = require('mongoose')
const profileSchema = require('./profile')
// const serviceSchema = require('./service')
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		isFreelancer: {
			type: Boolean,
			required: true,
			default: false
		},
		profile: profileSchema,
		enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)