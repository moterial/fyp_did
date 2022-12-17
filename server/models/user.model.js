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
    email: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    //certificate as a array of objects with certificate name, certificate id, approved by, date of issue with default values
    certificate: [{
        certificateName: {
            type: String,
            
        },
        approvedBy: {
            type: Schema.Types.ObjectId
           
        },
        dateOfIssue: {
            type: Date,
            
        }
        
    }],
    

})

const User = mongoose.model('User', userSchema);

module.exports = User;