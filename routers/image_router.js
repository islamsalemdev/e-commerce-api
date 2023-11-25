const express = require('express');
const imageRouter = express.Router();
const imageSchema = require('../models/image'); 
const multer = require('multer'); 
const fs = require('fs'); 
const path = require('path');
const ImageSchema = require('../models/image');
const { json } = require('express/lib/response');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  imageRouter.post('/upload', upload.single('file'),async (req, res) => {
    const imageModel = new ImageSchema({
        image : req.file.path,
        email : req.body.email, 
        password : req.body.password, 
        name: req.body.name, 
    
    }); 
    await imageModel.save();
    res.json(imageModel);
    console.log(imageModel);
//     console.log(req.file);
//   console.log(req.body.email);
//   console.log(req.body.password);
//   res.send('File uploaded successfully!');
  });

  module.exports = imageRouter; 