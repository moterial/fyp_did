const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];

    if (token == null) return res.sendStatus(401)

  

    jwt.verify(token, "accessToken" , (err, user) => {
      console.log(err)
  
      if (err) return res.json("Token is not valid")
      console.log(user.username.username)
      console.log(req.body.username)
      if(user.username.username == req.body.username){
        //check if it is the same as the database
        next()
      }else{  
        return res.json("Token is not valid2")
      } 
      
  
    })
   
};
