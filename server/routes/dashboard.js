const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').post((req, res) => {
    const username = req.body.username;
    //get the certificate data from the user
    User.findOne({
        username: username
    })
    .then(user => {
        if(user){
            res.json({status: "success", message: "User found", data: user.certificate});
        }else{
            res.json({status: "error", message: "User not found"});
        }
    })

        

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