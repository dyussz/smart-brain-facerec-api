const  handleSignin = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body; 
       if (!email ||  !password ) {
        return res.status(400).json('incorrect form submission'); //needed to stop the function if anything is missing and const hash will not be created//
    }
 
  db.select('email', 'hash').from('login')
    .where('email', '=', email) 
    .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash); 
    if (isValid) {
        return db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
            console.log("User signed in:" + user[0]);
            res.json(user[0])
        })
        .catch(err => {
            console.log("Enable to get user", e)
            res.status(400).json('unable to get user')
        })
    } else {
    res.status(400).json('wrong credentials'); //if anything goes wrong, i'll get back json with wrong credentials//
    }
 })
    .catch(err => {
        console.log("Error signing in", err);
        res.status(400).json('wrong credentials')
    })
};

module.exports = {
    handleSignin : handleSignin
} 