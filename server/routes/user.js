const router = require('express').Router();
const User = require('../models/user.model');

router.route('/login').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        username: username,
        password: password
    })
    .then(user => {
        if(user){
            res.json({status: "success", message: "User logged in successfully"});
        }else{
            res.json({status: "error", message: "User not found"});
        }
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));


    
})

router.route('/register').post((req, res) => {
    //check if user already exists
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    User.find({
        username: username
    })
    .then(user => {
        if(user.length > 0){
            res.json({status: "error", message: "User already exists"});
        }else{
            const newUser = new User({
                username,
                password,
                email,
                phone
            });
            newUser.save()
            .then(() => res.json({status: "success", message: "User registered successfully"}))
            .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
        }
    })
    
    
});

module.exports = router;