const { ApolloServer } = require('apollo-server')

const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { findOrCreateUser } = require('./controllers/userController')


mongoose
    .connect(process.env.DB_URI, {useNewUrlParser: true})
    .then( () => { console.log('DB connected')})
    .catch( err => { console.error(err)})

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken = null
        let currentUser = null
        try {
            authToken = req.headers.authorization
            if(authToken) {
                currentUser = await findOrCreateUser(authToken)
            }
        } catch (err) {
            console.error(`Error with the authentication- ${authToken}`)
        }
        return { currentUser }
    }
})

server.listen().then(({url}) =>{
    console.log(`Server is listening on ${url}`)
} )