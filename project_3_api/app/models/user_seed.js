
// user_seed js is going to be the file we run whenever we want to seed our database with users

const mongoose = require('mongoose')
const User = require('./user')
const db = require('../../config/db')

const startUsers = [
    { name: 'Scyther', email: 's@s.s', hashedPassword: "s", isFreelancer: "true"},
    { name: 'Dunkin', email: 'd@d.d', hashedPassword: "d", isFreelancer: "true"},
    { name: 'Pikachu', email: 'p@p.p', hashedPassword: "p", isFreelancer: "true"},
    { name: 'Marill', email: 'm@m.m', hashedPassword: "m", isFreelancer: "true"},
    { name: 'Charmander', email: 'c@c.c', hashedPassword: "c", isFreelancer: "true"},
    { name: 'Bulbasaur', email: 'b@b.b', hashedPassword: "b", isFreelancer: "false"},
    { name: 'Wartortle', email: 'w@w.w', hashedPassword: "w", isFreelancer: "false"},
    { name: 'Mr. Mime', email: 'mm@m.m', hashedPassword: "m", isFreelancer: "false"},
    { name: 'Reloj', email: 'r@r.r', hashedPassword: "r", isFreelancer: "false"},
    { name: 'Quincy', email: 'q@q.q', hashedPassword: "q", isFreelancer: "false"},
]

// first, we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        // first we remove all of the services
        // here we can add something to make sure that we only delete services without an owner
        User.deleteMany( )
            .then(deletedUsers => {
                console.log('Here are the deleted services: \n', deletedUsers);
                // the next step is to use our startServices array to create our seeded services
                User.create(startUsers)
                    .then(newUsers => {
                        console.log('Here are the new services: \n', newUsers);
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