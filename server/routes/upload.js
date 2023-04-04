const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth')
const multer = require('multer');
const util = require('../util/token');
const Web3 = require('web3');
const Web3HDWalletProvider = require('@truffle/hdwallet-provider');
const mongoose = require('mongoose');

// // Create a schema for the image data
// const imageSchema = new mongoose.Schema({
//     name: String,
//     contentType: String,
//     data: Buffer,
// });
  
// // Create a model for the image data
// const Image = mongoose.model('Image', imageSchema);
  
// // Configure multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

//   // Route to handle file upload
// router.post('/setImage', upload.single('image'), async (req, res) => {
//     const newImage = new Image({
//       name: req.file.originalname,
//       contentType: req.file.mimetype,
//       data: req.file.buffer,
//     });
//     await newImage.save();
//     //store image in database
//     const username = req.body.username;
    

    
//     User.findOne({
//         username: username
//     })
//     .then(user => {
//         if(user){
//             //update the token in the database enable upsert
//             User.findOneAndUpdate({
//                 username: username
//             }, {
//                 $set: {
//                     faceImage: newImage._id
//                 }
//             }, {
//                 upsert: true
//             })
//             .then(() => res.json({status: "success", message: "User logged in successfully"}))
            
//         }else{
//             res.json({status: "error", message: "User not found"});
//         }
//     })
// });

// module.exports = router;