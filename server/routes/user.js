const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth')
const util = require('../util/token');
const Web3 = require('web3');
const Web3HDWalletProvider = require('@truffle/hdwallet-provider'); 

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

router.route('/checkUsername').post((req, res) => {
    const username = req.body.username;
    User.find({
        username: username
    })
    .then(user => {
        if(user.length > 0){
            res.json({status: "error", message: "User already exists"});
        }else{
            res.json({status: "success", message: "User not exists"});
        }
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
})

router.route('/register').post((req, res) => {
    //check if user already exists
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    const token = util.generateAccessToken({username: username});
    const walletAddress = req.body.walletAddress;
    const walletPrivateKey = req.body.walletPrivateKey;
    const bios = req.body.bios;


    User.find({
        username: username
    })
    .then(user => {
        if(user.length > 0){
            res.json({status: "error", message: "User already exists"});
        }else{
            const newUser = new User({
                username: username,
                password: password,
                email: email,
                phone: phone,
                token: token,
                walletAddress: walletAddress,
                walletPrivateKey: walletPrivateKey,
                bios: bios,
                name: name    
            });

            const account = walletAddress;
            const amount = '0.005';
            const ETHprovider = "c1f3a393d0adfaaead4303bdae71e7166cd49366bdec69f0fc75cf7ae2fdbaf2"

            const provider = new Web3HDWalletProvider(ETHprovider,"HTTP://127.0.0.1:7545")     
            const web3 = new Web3(provider)
            
            web3.eth.sendTransaction({from: '0x062e389556f1A103E99B99c1e9CDEE2d544B5798', to: account, value: web3.utils.toWei(amount, "ether")})
            .then((data) => {
                console.log(data);
                newUser.save()
                .then(() => res.json({status: "success", message: "User registered successfully",token: token}))
                .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
                
            })
            .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
            
            
        }
    })
    
    
});


router.post('/update', auth, (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const bios = req.body.bios;

    User.findOneAndUpdate({
        username: username
    }, {
        $set: {
            name: name,
            email: email,
            phone: phone,
            bios: bios
        }
    }, {
        upsert: true
    })
    .then(() => res.json({status: "success", message: "User updated successfully"}))
    .catch(err =>{
        console.log(err);
    
        res.status(400).json({status: "error", message: "Error: " + err})
    });
})

router.post('/logout',  (req, res) => {
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

router.post('/findUserByAddress', (req, res) => {
    let address = req.body.address;
    //change string to hex
    address = address.toString(16);
    //change the hex to decimal
    address = parseInt(address, 16);
    console.log(address);
    User.findOne({
        num: address
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

router.post('/topup',auth, (req, res) => {
    const account = req.body.account;
    const amount = req.body.amount;
    const ETHprovider = "e8bdd1316c5dd0cf356cbc377a31af68c2363994bc786b8698a34b5a9319b836"
    console.log(account);
    //connect to the local node
    const provider = new Web3HDWalletProvider(ETHprovider,"HTTP://127.0.0.1:7545")     
    const web3 = new Web3(provider)

    web3.eth.sendTransaction({from: '0x54733531653F802fBb534bb621C39d5fD49ed414', to: account, value: web3.utils.toWei(amount, "ether")})
    .then((data) => {
        console.log(data);
        res.json({status: "success", message: "Topup successful"});
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
    





})



module.exports = router;