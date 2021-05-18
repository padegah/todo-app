

const express = require("express");

const router = express.Router();

// import the JSON library
const jwt = require("jsonwebtoken");

var methodOverride = require('method-override');
// const config = require("../../config/config");

// set method override middleware to support PUT and DELETE methods in HTML forms
router.use(methodOverride('_method'))

const config = require("../../config/config");

// register home page
router.get("/login/page", function(req, res){

    // show login form to user
    res.send(` 
    <html> 
        <body>
            <form action="/users/login" method="POST">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter Username"/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter Password"/>
                </div>
                <div>
                    <input type="submit" value="login"/>
                </div>
            </form>
        </body>
    </html> `);
});

// register post login route
router.post("/login", function(req, res){

    // get username and password from request body
    let username = req.body.username;
    let password = req.body.password;

    // check for valid credentials
    if (username === config.user.username && password === config.user.password) {

        // create payload
        const payLoad = {username: username, firstname: "prince", lastname: "adegah"};

        // get secret from config file
        const secret = config.jwtSecret;

        // sign the payload to generate a token
        jwt.sign(payLoad, secret, function(err, token){

            // if error occured during signing
            if(err){
                
                // send status 500 with error message
                res.status(500).json({
                    status: "failure",
                    code: "authentication-error"
                });
            }
            // if success
            else{
                // respond with success message
                res.json({
                    status: "success",
                    token: token
                });
            }
        });
    }
    // check for invalid credentials
    else {

        // if request is from web, redirect to same page
        if(req.accepts('text/html')){
            res.redirect('/users/login');
            return;
        }
    
        // if request is from API, return failure message as an object
        return res.status(401).json({
            status:'failure',
            code: "not-authenticated",
            message: "Invalid credentials"
        });
    }
});


module.exports = router;
