var express = require('express');
var app = express();
 
app.get('/api/home', function (req, res) {
    res.json({name: 'John', age: 30});
    
})
 
var server = app.listen(8000, function () {
 
  var host = server.address().address
  var port = server.address().port
  
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})