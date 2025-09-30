const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors'); 
const knex = require('knex');
const { user } = require('pg/lib/defaults');

// Fix controller imports with proper relative paths
const register = require('./controllers/register.js');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const APP_PORT = process.env.APP_PORT || 3001;
console.log(DB_USER);
console.log(DB_PASSWORD);

//statement to insert users when they register//
const db = knex({
  client: 'pg',
  connection: {
    host : DB_HOST,
    user : DB_USER,
    password : DB_PASSWORD,
    database : 'smart_brain'
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());


//create a route for the root
app.get('/', (req, res) => {
    res.send('Smart Brain API running');});

//sign-in route.containing hash into a table//
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

//new user with register route. create transaction when need to do more than 2 things at once.   //
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//loop for matching user id//
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)}); //why is get? 


//updates the entries and increase count
app.put('/image',  (req, res) => { image.handleImage(req, res, db)}); 

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});


//hash password with bcrypt//
bcrypt.hash("bacon", null, null, function(err, hash) {
});

// Start the server only if this file is run directly\
console.log('App is starting on port ' + APP_PORT);
if (require.main === module) {
    app.listen(APP_PORT, () => {
        console.log('App is running on port ' + APP_PORT);
    });
}

// Export the app for testing
module.exports = app;