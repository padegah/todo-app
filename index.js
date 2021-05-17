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


app.use(function(req, res, next){

    // if req is coming from browser, no authentication, just proceed
    if(req.accepts('text/html') || req.url.startsWith("/users/login")){
        next();
        return;
    }

    const authString = req.headers["authorization"];

    if (!authString) {
        res.status(400).json({
            status: "failure",
            code: "not-authorized",
            message: "user not authorized"
        });

        return;
    }

    const token = authString.split(" ")[1];

    const secret = config.jwtSecret;

    jwt.verify(token, secret, function(err, payload){

        if(err){
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