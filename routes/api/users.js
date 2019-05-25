//Pulling in required dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load Input Validation functions
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User model
const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req,res) => {
    //Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);
    
    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then( user => {
            if(user){
                return res.status(400).json({ email : "Email already exists" });
            }else {
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password
                });
                //Hash password before storing in the Database 
                bcrypt.genSalt(8, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then( user => res.json(user))
                               .catch( err => console.log(err));
                    });
                });
            }
        });
});