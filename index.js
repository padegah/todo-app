const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const todosRoute = require("./app/src/controllers/todos/todos");

const users = require("./app/src/controllers/users/users");

const config = require("./app/src/config/config");

// register middleware to protect endpoints from users not logged in.
app.use(function(req, res, next){

    // we intend doing authentication for API clients only, therefore if request is coming from a client that expects html probably the browser, no authentication, just proceed
    if(req.accepts('text/html') || req.url.startsWith("/users/login")){
        next();
        return;
    }

    // get the authorization header field value
    const authString = req.headers["authorization"];

    // if no authorization header passed return bad request.
    if (!authString) {
        res.status(400).json({
            status: "failure",
            code: "not-authorized",
            message: "user not authorized"
        });

        return;
    }

    // extract the token
    const token = authString.split(" ")[1];

    const secret = config.jwtSecret;

    // verify the token is valid
    jwt.verify(token, secret, function(err, /* Holds payload passed when jwt.sign was called */payload){
        if(err){
            // if verification failed, then return 401 and auth error.
            res.status(401).json({
                code: "authentication-error"
            });
        }else{
            // req.user = payload;
            // console.log(payload);
            next();
        }
    });
    
});

app.use("/todos", todosRoute);

app.use("/users", users);

app.listen(3000, function() {
    console.log("Todo App Server is up and running on port 3000...");
});
