const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];

    if (token == null) return res.json({status: "error", message: "Token is not valid"})


    jwt.verify(token, "accessToken" , (err, user) => {
      console.log(err)
  
      if (err) return res.json({status: "error", message: "Token is not valid"})
      
      if(user.username.username == req.body.username){
        //check if the token is the same as the one in the database
        User.findOne({
          username: user.username.username
        })
        .then(user => {
          if(user){
            if(user.token == token){
              next()
            }else{
              return res.json({status: "error", message: "Token is not valid"})
            }   
          }
        })
      }else{  
        return res.json({status: "error", message: "Token is not valid"})
      } 
      
  
    })
   
};
