const express = require('express');
const app = express();
const jwt = require("jsonwebtoken")
app.use(express.json());

let refreshTokens = [];

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401).json("You are not authenticated");
    jwt.verify(token, 'jwt', (err, user) => {
      if(err){
        console.log(err);
        return res.json("Token is not valid");
      } 
      req.user = user;
      next();
    })
}

app.post('/api/refresh', function (req, res) {
    const token = req.body.token;
    if(token == null) return res.json("You are not authenticated");

    if(!refreshTokens.includes(token)) return res.json("Refresh Token is not valid");
    jwt.verify(token, 'refreshjwt', (err, user) => {
      if(err) return res.json("Refresh Token is not valid");
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newAccessToken);

      res.json({accessToken: newAccessToken, refreshToken: newRefreshToken});
    })

})

const generateAccessToken = (user) => {
    var token = jwt.sign({username:user }
      , 'jwt'
      , {expiresIn: '20s'})
    return token;
}

const generateRefreshToken = (user) => {
  var token = jwt.sign({username:user }, 'refreshjwt', {expiresIn: '20s'})
  return token;
}


app.post('/api/login', function (req, res) {
   const user = req.body;
    const username = user.username;
    const password = user.password;
    const userFound = users.find(user => user.username === username && user.password === password);
    if(userFound){
        const accessToken = generateAccessToken(username); 
        const refreshToken = generateRefreshToken(username);


        refreshTokens.push(refreshToken);
        res.json({accessToken: accessToken, refreshToken: refreshToken});
    }
   
})



app.delete('/api/user/:userId', verifyToken, function (req, res) {
  if(req.user.username === 'admin'){
    const userId = req.params.userId;
    const user = users.find(user => user.id === parseInt(userId));  
    if(user){
      const index = users.indexOf(user);
      users.splice(index, 1);
      console.log(users);
      res.json({status: 'success'});

    }
  }
  else{
    console.log('error');
    res.json({status: 'error'});
  }
     
})

app.post('/api/logout', verifyToken, function (req, res) {
  const refreshToken = req.body.token;
  console.log(refreshTokens);
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log(refreshTokens);
  res.json("Logged out");
})

