const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth')
const util = require('../util/token');

router.route('/login').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        username: username,
        password: password
    })
    .then(user => {
        if(user){
            //generate token
            const token = util.generateAccessToken({username: user.username});
            res.cookie('token', token, {httpOnly: true});
            //update the token in the database enable upsert
            User.findOneAndUpdate({
                username: username
            }, {
                $set: {
                    token: token
                }
            }, {
                upsert: true
            })
            .then(() => res.json({status: "success", message: "User logged in successfully", token: token}))
            
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

router.post('/logout', auth, (req, res) => {
    //remove the token from the database
    User.findOneAndUpdate({
        username: req.body.username
    }, {
        $set: {
            token: null
        }
    }, {
        upsert: true
    })
    .then(() => res.json({status: "success", message: "User logged out successfully"}))
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
})

module.exports = router;