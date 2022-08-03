// import dependencies
const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        default: ''
    },
    aboutMe: {
        type: String,
        required: true,
        default: ''
    },
    image: {
        type: String,
        required: false,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }

}, {
    timestamps: true
})

module.exports = profileSchema