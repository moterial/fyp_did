const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken")
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user.model');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true}
);

let gfs;
const connection = mongoose.connection;
connection.once('open', () => {
  gfs = Grid(connection, mongoose.mongo);
  gfs.collection('faces');
  console.log("MongoDB database connection established successfully");
})

// configure storage engine for Multer
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return {
      filename: crypto.randomBytes(16).toString('hex') + '.jpg',
      bucketName: 'faces'
    };
  }
});

// create a Multer instance with the configured storage engine
const upload = multer({ storage });

const usersRouter = require('./routes/user');
const dashBoardRouter = require('./routes/dashboard');
const uploadRouter = require('./routes/upload');


// // define the POST route for the faces endpoint
// app.post('/api/faces', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // add the face image to the user with the specified username
  
//   const fileId = req.file.id;


//   User.findOneAndUpdate(
//     { username: 'admin' },
//     { $addToSet: { faceImages: fileId } },
//     { new: true },
//     (err, user) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to add face image to user' });
//       }
//       return res.status(200).json({ message: 'Face image saved successfully' });
//     }
//   );
// });

app.use('/api/user', usersRouter);
app.use('/api/dashboard', dashBoardRouter);
// app.use('/api/upload', uploadRouter);



app.listen(5000, function () {  
    console.log('app listening on port 5000!')
})