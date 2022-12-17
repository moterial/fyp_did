const jwt = require('jsonwebtoken');


function generateAccessToken(username) {
    return jwt.sign({username:username }, "accessToken", { expiresIn: '1800s' });
}

//refresh token
function generateRefreshToken(username) {
    return jwt.sign({username:username },"refreshToken", { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, "accessToken" , (err, user) => {
      console.log(err)
  
      if (err) return res.json("Token is not valid")
  
      req.AuthUser = user
  
      next()
    })
}

function authenticateRefreshToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, "refreshToken" , (err, user) => {
      console.log(err)
  
      if (err) return res.json("Token is not valid")
  
      req.AuthUser = user
  
      next()
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    authenticateToken,
    authenticateRefreshToken
}