const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true}
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const usersRouter = require('./routes/user');
const dashBoardRouter = require('./routes/dashboard');


app.use('/api/user', usersRouter);
app.use('/api/dashboard', dashBoardRouter);


app.listen(5000, function () {  
    console.log('app listening on port 5000!')
})