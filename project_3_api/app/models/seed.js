// seed js is going to be the second file we run whenever we want to seed our database

const mongoose = require('mongoose')
const Service = require('./service')
const db = require('../../config/db')

// update the owner ID after you've created the users
const startServices = [
    { name: 'Animal Psychic Reading', type: 'paranormal', description: "Let me communicate telepathically with your animal from anywhere in the world.", location: "Zoom Call", rate: 60, owner: "62f15d803cced3f772227a67"},
    { name: 'Rhythmic Dance Lesson', type: 'dance', description: "Learn how to unleash the animal within with our rhythmic dance lesson.", location: "Boston Common",  rate: 50, owner: "62f15d803cced3f772227a68"},
    { name: 'Custom Yodeling Song', type: 'music', description: "I will compose and perform a custom yodeling song set to the theme of your choice.", location: "Worldwide",  rate: 200, owner: "62f15d803cced3f772227a6f"},
    { name: 'Photoshop Services', type: 'design', description: "I will make you hot virtually.", location: "Anywhere",  rate: 5, owner: "62f15d803cced3f772227a6f"},
    // new seed information
    { name: 'Anime Theme Song Creator', type: 'music', description: "I will compose a cong for your anime.", location: "remote", rate: 200, owner: "62f15d803cced3f772227a6b"},
    { name: 'Custom Stuffed Animal', type: 'textiles', description: "Let me make a stuffed animal for you.", location: "remote",  rate: 50, owner: "62f15d803cced3f772227a6b"},
    { name: 'Gerbil Reiki', type: 'spirituality', description: "I provide Reiki services to gerbils specifically through Zoom.", location: "Zoom",  rate: 80, owner: "62f15d803cced3f772227a6b"},
    { name: 'Pavlovian Training', type: 'lifestyle', description: "Do you want to salivate on command? I can train you through Zoom!", location: "Anywhere",  rate: 25, owner: "62f15d803cced3f772227a6b"},
    { name: 'Custom Short Story', type: 'literature', description: "Let me write a 5k word short story to your specifications.", location: "remote",  rate: 50, owner: "62f15d803cced3f772227a6b"},
    { name: 'Unpaid Internship', type: 'professional', description: "Let me be your unpaid intern for a small fee!", location: "Anywhere",  rate: 1500, owner: "62f15d803cced3f772227a6b"},
    { name: 'Yakity Sax Sound Effects On Command', type: 'music', description: "I will follow you around and play Yakity Sax when it would be funny.", location: "Travel Pending",  rate: 450, owner: "62f15d803cced3f772227a6a"},
    { name: 'Macrame Wall Art', type: 'textiles', description: "I create unique macrame creations", location: "remote",  rate: 50, owner: "62f15d803cced3f772227a6a"},
]

// first, we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        // first we remove all of the services
        // here we can add something to make sure that we only delete services without an owner
        Service.deleteMany()
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