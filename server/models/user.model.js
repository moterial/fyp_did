const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        minlength: 3 
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    walletAddress:{
        type: String,
    },
    walletPrivateKey:{
        
        type: String,
    },
    token:{
        type: String,
    },
    faceImage:{
        name: String,
        img:
        {
            data: Buffer,
            contentType: String
        }
    },
    email: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    bios:{
        type: String,
    },
    name:{
        type: String,
    },
    faceImage:{
        type: mongoose.Schema.Types.ObjectId
    },
    faceDescriptor:{
        type: any
    }
    
    

})

const User = mongoose.model('User', userSchema);

module.exports = User;