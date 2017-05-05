//Major APIs dealing with todo database

// define and initialize the model =================
var mongoose = require('mongoose');
var todoSchema = mongoose.Schema({
    user: String,
    text: String,
    productivity: Number,
    hours: Number,
    tags: [],
    createdTime: Date,
    finishedTime: Date,
    done: Boolean,
    happiness: Number,
    stress: Number
});
var TodoDB = mongoose.model('Todos', todoSchema);

//Initialize the todo database with one single todo item
var initializeTodo = function() {
    TodoDB.remove(function(err) {
        if (err) {
            console.log("Error in dropping Todo DB:" + err)
        }
    });

    TodoDB.create({
        user: "Summer",
        text: "Sample first todo item",
        productivity: 0,
        done: false,
        createdTime: new Date(),
    }, function(err, todo) {
        console.log(todo);
    });

    TodoDB.create({
        user: "billhebillhe@gmail.com",
        text: "Twitter Project",
        productivity: 4,
        happiness: 2,
        stress: 3,
        done: true,
        createdTime:"2017-03-24T08:26:00.165Z",
        finishedTime:"2017-03-10T08:26:01.511Z",
        hours:9,
        tags: ["Work"]
    }, function(err, todo) {
        console.log(todo);
    });

    TodoDB.create({
        user: "billhebillhe@gmail.com",
        text: "Elo Project",
        productivity: 5,
        happiness: 4,
        stress: 2,
        done: true,
        createdTime:"2017-03-25T03:16:00.165Z",
        finishedTime:"2017-03-25T06:16:01.511Z",
        hours:6,
        tags: ["Work"]
    }, function(err, todo) {
        console.log(todo);
    });

    TodoDB.create({
        user: "billhebillhe@gmail.com",
        text: "Formal",
        productivity: 3,
        happiness: 3,
        stress: 4,
        done: true,
        createdTime:"2017-03-26T10:29:00.165Z",
        finishedTime:"2017-03-26T10:29:01.511Z",
        hours:4,
        tags: ["Social"]
    }, function(err, todo) {
        console.log(todo);
    });

}

//Return (err, lise of all todo items) to callback function
var displayUnfinishedTodos = function(route_callbck) {
    TodoDB.find({ done: false }, function(err, todos) {
        if (err) {
            console.log("Failed to get all Todos in server:" + err);
        }
        route_callbck(err, todos);
    });
}

var displayAllTodos = function(route_callbck) {
    TodoDB.find(function(err, todos) {
        if (err) {
            console.log("Failed to get all Todos in server:" + err);
        }
        route_callbck(err, todos);
    });
}

var displayAllTodosForUser = function(email, route_callbck) {
    TodoDB.find({user: email}, function(err, todos) {
        if (err) {
            console.log("Failed to get all Todos for the user in server:" + err);
        }
        route_callbck(err, todos);
    });
}

var displayAllUnfinishedTodosForUser = function(email, route_callbck) {
    TodoDB.find({user: email, done: false}, function(err, todos) {
        if (err) {
            console.log("Failed to get all Todos for the user in server:" + err);
        }
        route_callbck(err, todos);
    });
}

//Return (err, lise of all todo items) to callback function
var getTodoById = function(todoId, route_callbck) {
    TodoDB.find({ _id: todoId }, function(err, todo) {
        if (err) {
            console.log("Failed to get " + todoId + " Todo item in server:" + err);
        }
        route_callbck(err, todo);
    });
}

//Add an item to the todo database
//Return the err message or the newly added todo item to callback function
var addTodoItem = function(email, newTodoText, route_callbck) {
    TodoDB.create({
            user: email,
            text: newTodoText,
            time: 0,
            done: false,
            createdTime: new Date()
        },
        function(err, todo) {
            if (err) {
                route_callbck(err, null);
            }
            route_callbck(null, todo);
        });
}

//Delete a todo item by id
//Return th err message or the todo item deleted to callback function
var deleteTodoItem = function(id, route_callbck) {

    TodoDB.update({
            _id: id
        }, { $set: { done: true } },
        function(err, todo) {
            if (err) {
                console.log("Fail to update todo in server:" + id);
                route_callbck(err, null);
            } else {
                route_callbck(null, todo);
            }
        });
}

//Update the existing todo item with id to newTodo
var editTodoItem = function(id, newTodo, route_callbck) {
    TodoDB.update({
            _id: id
        },
        newTodo,
        function(err, todo) {
            if (err) {
                console.log("Fail to update todo in server:" + id);
                route_callbck(err, null);
            } else {
                route_callbck(null, todo);
            }
        });
}

var addPomodoroTime = function(id, new_time, route_callbck) {
    TodoDB.update({
            _id: id
        }, { $set: { time: new_time } },
        function(err, todo) {
            if (err) {
                console.log("Fail to update todo time in server:" + id);
                route_callbck(err, null);
            } else {
                console.log("add todo time done");
                route_callbck(null, todo);
            }
        });
}

var todoModule = {
    initializeTodo: initializeTodo,
    displayUnfinishedTodos: displayUnfinishedTodos,
    addTodoItem: addTodoItem,
    deleteTodoItem: deleteTodoItem,
    getTodoById: getTodoById,
    editTodoItem: editTodoItem,
    displayAllTodos: displayAllTodos,
    displayAllTodosForUser: displayAllTodosForUser,
    displayAllUnfinishedTodosForUser: displayAllUnfinishedTodosForUser,
    addPomodoroTime: addPomodoroTime
};

module.exports = todoModule;
