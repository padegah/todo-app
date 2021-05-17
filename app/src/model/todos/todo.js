

const config = require("../../config/config");

// create todo array
let todostore = [];

// populate todo array with fake data if usefake is true
if (config.usefake){
    todostore.push({
        id: 1011,
        title: "Work item",
        date: Date.now(),
        type: "Work",
        description: "To complete work assignment"
    },
    {
        id: 2011,

        title: "Home item",
        date: Date.now(),
        type: "Home",
        description: "To complete home assignment"
    },
    {
        id: 3011,
        title: "Park item",
        date: Date.now(),
        type: "Park",
        description: "To complete park assignment"
    },
    {
        id: 4011,
        title: "Church item",
        date: Date.now(),
        type: "Church",
        description: "To complete church assignment"
    });
    
}


module.exports = {
    // add item to todo array
    addTodo: function(todo) {
        
        const id = Date.now();

        todo.id = id;

        // add item to todo array
        todostore.push(todo);

        return todo;
    },
    // delete item from array
    deleteTodo: function(id) {
        // create temporal store
        const tempStore = [];

        // for each todo item
        for(const todo of todostore){
            // if todo does not match the deleted id
            if( todo.id != id ){
                // push todo to temporary store
                tempStore.push(todo);
            }
        }
        // assign temporal store to todoarray which exludes deleted item
        todostore = tempStore;
    },
    // edit todo item
    editTodo: function(id , todo) {
        const tempStore = [];

        todo.id = id;

        for(const todoitem of todostore){
            if( todoitem.id == id ){
                tempStore.push(todo);
            }
            else tempStore.push(todoitem);
        }

        todostore = tempStore;

        return todo;
    },
    getTodos: function(todo) {
        return todostore.slice(0);
    },
    getTodo: function(id) {
        for (const todo of todostore) {
            if (todo.id == id) {
                return todo;
            }
        }
        return null;
    },
}