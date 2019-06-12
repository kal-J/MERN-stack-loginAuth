const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const users = require('./routes/api/users');

//Initialize app with express
const app = express(); 
app.use(cors());

//Body-parser middleware which is integrated in express
app.use(express.json());
// mongoDB config
const db = require('./config/keys').mongoURI;

//connect to mongoDB
mongoose.connect(db,{useNewUrlParser:true})
        .then( ()=> console.log("mongoDB connected successfully"))
        .catch( (err) => console.log(err));

        //Passport middleware
        app.use(passport.initialize());
        //Config passport
        require('./config/passport') (passport);

        app.use('/api/users', users);
//Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
        //set static folder
        app.use(express.static('client/build'));
        app.get('*',(req,res) => {
                res.sendFile(path.resolve(__dirname,"client","build","index.html"));
        });
}
//set up PORT
const PORT = process.env.PORT || 5000;

//Listen for requests
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));