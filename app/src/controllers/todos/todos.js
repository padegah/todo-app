const express = require("express");
const router = express.Router();
var methodOverride = require('method-override')

router.use(methodOverride('_method'))

const Todos = require("../../model/todos/todo");

router.get("/", function(req, res){

    const todos = Todos.getTodos();

    let htmlFrag = '';

    for ( let todo of todos ){
        htmlFrag += `<tr>
        <td>${todo.title}</td><td>${todo.date}</td><td>${todo.type}</td><td>${todo.description}</td>
        
        <td><form method="POST" action="/todos/${todo.id}?_method=DELETE"><input type="submit" value="delete"/></form></td>
        </tr>`;
    }

    res.send(` 
    <html> 
        <body>
            <div>
                <a href="/todos/create">Add Item </a>
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
});

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
                        <option value="stufy">Study</option>
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

router.post("/", function(req, res){
    const newTodo = {
        title: req.body.title,
        date: Date.parse(req.body.date),
        type: req.body.type,
        description: req.body.description
    };

    const savedTodo = Todos.addTodo(newTodo);

    if(req.is('application/json')){
        return res.json({
            status:'sucess',
            result:savedTodo,
        });
    }


    return res.redirect("/todos");
});

router.put("/:id", function(req, res){

});

router.delete("/:id", function(req, res){
    let id = req.params.id;
    Todos.deleteTodo(id);

    return res.redirect("/todos");
});

module.exports = router;