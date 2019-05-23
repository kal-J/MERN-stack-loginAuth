const express = require('express');
const mongoose = require('mongoose');

//Initialize app with express
const app = express(); 

//Body-parser middleware which is integrated in express
app.use(express.json());

// mongoDB config
const db = require('./config/keys').mongoURI;

//connect to mongoDB
mongoose.connect(db,{useNewUrlParser:true})
        .then( ()=> console.log("mongoDB connected successfully"))
        .catch( (err) => console.log(err));

//set up PORT
const PORT = process.env.PORT || 5000;

//Listen for requests
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));