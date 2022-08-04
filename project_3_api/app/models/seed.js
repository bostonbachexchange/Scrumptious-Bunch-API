// seed js is going to be the file we run whenever we want to seed our database

const mongoose = require('mongoose')
const Service = require('./service')
const db = require('../../config/db')

const startServices = [
    { name: 'Animal Psychic Reading', type: 'paranormal', description: "Let me communicate telepathically with your animal from anywhere in the world.", location: "Zoom Call", rate: 60, owner: "62eaac5550f1685008953240"},
    { name: 'Rhythmic Dance Lesson', type: 'dance', description: "Learn how to unleash the animal within with our rhythmic dance lesson.", location: "Boston Common",  rate: 50, owner: "62eaac5550f1685008953240"},
    { name: 'Custom Yodeling Song', type: 'music', description: "I will compose and perform a custom yodeling song set to the theme of your choice.", location: "Worldwide",  rate: 200, owner: "62eaac5550f1685008953240"},
    { name: 'Photoshop Services', type: 'design', description: "I will make you hot virtually.", location: "Anywhere",  rate: 5, owner: "62eaac5550f1685008953240"}
]

// first, we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        // first we remove all of the services
        // here we can add something to make sure that we only delete services without an owner
        Service.deleteMany( {owner: null} )
            .then(deletedServices => {
                console.log('Here are the deleted services: \n', deletedServices);
                // the next step is to use our startServices array to create our seeded services
                Service.create(startServices)
                    .then(newServices => {
                        console.log('Here are the new services: \n', newServices);
                        mongoose.connection.close();
                    })
                    .catch(error => {
                        console.log(error);
                        mongoose.connection.close();
                    })
            })
            .catch(error => {
                console.log(error);
                mongoose.connection.close();
            })
    })
    .catch(error => {
        console.log(error);
        mongoose.connection.close();
    })