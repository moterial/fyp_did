const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth')

//check if user is logged in before getting details of user
router.post('/',auth, (req, res) => {
    const username = req.body.username;

    User.findOne({
        username: username
    })
    .then(user => {
        if(user){
            res.json({status: "success", message: "User found", user: user});
        }else{
            res.json({status: "error", message: "User not found"});
        }
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
})





router.route('/addCertificate').post((req, res) => {
    const username = req.body.username;
    const certificate = req.body.certificate;
    User.findOne({  
        username: username
    })
    .then(user => {
        if(user){
            user.certificate.push(certificate);
            user.save()
            .then(() => res.json({status: "success", message: "Certificate added successfully"}))
            .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
        }else{  
            res.json({status: "error", message: "User not found"});
        }   
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
})


module.exports = router;