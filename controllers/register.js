
const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) { //security check//
        return res.status(400).json('incorrect form submission'); //needed to stop the function if anything is missing and const hash will not be created//
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => { //we use this to return another trx to insert into users table and respond with json//
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit) //in order it was added, to make sure both of these queries run//
            .catch(trx.rollback); //if one of them fails, none of them will be done//
    })
        .catch(err => {
            console.log("Failed registration", err);
            res.status(400).json('unable to register');
        });

}
module.exports = {
    handleRegister: handleRegister
};
