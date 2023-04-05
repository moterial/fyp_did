const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth')
const multer = require('multer');
const util = require('../util/token');
const Web3 = require('web3');
const Web3HDWalletProvider = require('@truffle/hdwallet-provider'); 
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: String,
    contentType: String,
    data: Buffer,
});

// Create a model for the image data
const Image = mongoose.model('Image', imageSchema);
  
// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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


router.route('/facelogin').post((req, res) => {
    const username = req.body.username;
    const faceLoginResult = req.body.faceLoginResult;
    
    if(!faceLoginResult){
        res.json({status: "error", message: "Face login failed"});
        return;
    }


    User.findOne({
        username: username
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


//get image from username and return image
router.route('/faceid').post((req, res) => {
    //find the faceImage document ID from the username
    const username = req.body.username;
    User.findOne({
        username: username
    })
    .then(user => {
        if(user){
            
            Image.findById(user.faceImage)
            .then((image,user) => {
                if(image){
                    res.json({status: "success", message: "Image found", faceDescriptor: user.faceDescriptor, data: image.data});

                    
                }else{
                    res.json({status: "error", message: "Image not found"});
                }
            })
        }else{
            res.json({status: "error", message: "User not found"});
        }
    })
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

router.post('/register', upload.single('image'),  (req, res) => {
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
    .then( async(user) => {
        if(user.length > 0){
            res.json({status: "error", message: "User already exists"});
        }else{
            

            const newImage = new Image({
                name: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer,
              });
            await newImage.save();
            
            const newUser = new User({
                username: username,
                password: password,
                email: email,
                phone: phone,
                token: token,
                walletAddress: walletAddress,
                walletPrivateKey: walletPrivateKey,
                bios: bios,
                name: name,
                faceImage: new mongoose.Types.ObjectId(newImage._id),
                faceDescriptor : faceDescriptor
            });
            console.log(newUser);
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
    const ETHprovider = "c1f3a393d0adfaaead4303bdae71e7166cd49366bdec69f0fc75cf7ae2fdbaf2"
    console.log(account);
    //connect to the local node
    const provider = new Web3HDWalletProvider(ETHprovider,"HTTP://127.0.0.1:7545")     
    const web3 = new Web3(provider)

    web3.eth.sendTransaction({from: '0x062e389556f1A103E99B99c1e9CDEE2d544B5798', to: account, value: web3.utils.toWei(amount, "ether")})
    .then((data) => {
        console.log(data);
        res.json({status: "success", message: "Topup successful"});
    })
    .catch(err => res.status(400).json({status: "error", message: "Error: " + err}));
    

})



module.exports = router;