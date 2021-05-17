

const express = require("express");

const router = express.Router();

var methodOverride = require('method-override');
const todo = require("../../model/todos/todo");

// set method override middleware to support PUT and DELETE methods in HTML forms
router.use(methodOverride('_method'))

// import model
const Todos = require("../../model/todos/todo");

const {formatDate} = require("../../utils/utilities");

// register home page
router.get("/", function(req, res){

    // get all items from model
    const todos = Todos.getTodos();

    // form html code from 
    let htmlFrag = '';

    // for each todo found
    for ( let todo of todos ){
        htmlFrag += 
        `<tr>`

            // Print title
            +`<td>${todo.title}</td>`

            // Print date 
            +`<td>${formatDate(new Date(todo.date))}</td>`

            // Print type
            +`<td>${todo.type}</td>`

            // Print description
            +`<td>${todo.description}</td>`

            // Add a Delete button in the form of an html form
            +`<td><form method="POST" action="/todos/${todo.id}?_method=DELETE">
                    <input type="submit" value="delete"/>
                </form>
            </td>`

            // Add an Edit link
            +`<td>
                <a href="/todos/update/${todo.id}">Edit Item</a>
            </td>
        </tr>`;
    }

    // show all items in html
    if(req.accepts('text/html')){
        res.send(` 
        <html> 
            <body>
                <div>
                    <a href="/todos/create">Add Item </a> <hr>
                    <a href="/users/login/page">Log out </a>
                </div>
                <table>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Controls</th>
                    <tr>
                    ${htmlFrag}
                </table>
            </body>
        </html> `);
    } else {
        let nbr = todos.length;
        res.json({
            status: "success",
            message: `found ${nbr} items`,
            todos: todos
        });
    }
});

// register create page
router.get("/create", function(req, res){
    res.send(` 
    <html> 
        <body>
            <div>
                <a href="/todos">Back</a>
            </div>
            <form action="/todos" method="POST">
                <div>
                    <label> Title </label>
                    <input type="text" name="title"/>
                </div>
                <div>
                    <label> Date </label>
                    <input type="date" name="date"/>
                </div>
                <div>
                    <label> Type </label>
                    <select name="type">
                        <option value="cooking">Cooking</option>
                        <option value="travel">Travel</option>
                        <option value="study">Study</option>
                    </select>
                </div>
                <div>
                    <label> Description </label>
                    <input type="text" name="description"/>
                </div>
                <div>
                    <input type="submit"/>
                </div>
            </form>
        </body>
    </html> `);
});

// register update route
router.get("/update/:id", function(req, res){

    // get item based on id
    const todo = Todos.getTodo(req.params.id);

    // 404 feedback when id is not found
    if (!todo) {
        return res.status(404).end();
    }

    // show item details for user to edit
    res.send(` 
    <html> 
        <body>
            <div>
                <a href="/todos">Back</a>
            </div>
            <form action="/todos/${todo.id}?_method=PUT" method="POST">
                <div>
                    <label> Title </label>
                    <input type="text" name="title" value="${todo.title}"/>
                </div>
                <div>
                    <label> Date </label>
                    <input type="date" name="date" value="${formatDate(new Date(todo.date))}"/>
                </div>
                <div>
                    <label> Type </label>
                    <select name="type">
                        <option ${todo.type == "Work" ? "selected" : ""} value="Work">Work</option>
                        <option ${todo.type == "Home" ? "selected" : ""} value="home">Home</option>
                        <option ${todo.type == "Park" ? "selected" : ""} value="park">Park</option>
                        <option ${todo.type == "Church" ? "selected" : ""} value="church">Church</option>
                    </select>
                </div>
                <div>
                    <label> Description </label>
                    <input type="text" name="description" value="${todo.description}"/>
                </div>
                <div>
                    <input type="submit"/>
                </div>
            </form>
        </body>
    </html> `);
});

// register post route
router.post("/", function(req, res){

    const newDate = Date.parse(req.body.date) === null ? Date.now() : Date.parse(req.body.date);
    // console.log(Date.now());

    // get item details from request body
    const newTodo = {
        title: req.body.title,
        date: newDate,
        type: req.body.type,
        description: req.body.description
    };

    // save new item by calling addTodo
    const savedTodo = Todos.addTodo(newTodo);

    // if request is from browser, redirect user to todos page
    if(req.accepts('text/html')){
        return res.redirect("/todos");
    }

    // if request is from API, return saved data
    return res.json({
        status:'sucess',
        result:savedTodo
    });
});

// register put route
router.put("/:id", function(req, res){
    const id = req.params.id;

    // 
    const newTodo = {
        id,
        title: req.body.title,
        date: Date.parse(req.body.date),
        type: req.body.type,
        description: req.body.description
    };

    const savedTodo = Todos.editTodo(id, newTodo);

    // if request is from browser, redirect user to todos page
    if(req.accepts('text/html')){
        return res.redirect("/todos");
    }

    // if request is from API, return saved data
    return res.json({
        status:'sucess',
        result:savedTodo,
    });
});

// register delete route
router.delete("/:id", function(req, res){
    let id = req.params.id;
    Todos.deleteTodo(id);

    return res.redirect("/todos");
});

module.exports = router;