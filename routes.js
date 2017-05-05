//routes.js specifis the API implementations in server.js
//All functions are exported as a module to be used in server.js

var todoModel = require('./models/todo.js');
var userModel = require('./models/user.js');

//Return unfinished Todo items in JSON format
var displayUnfinishedTodos = function (req, res) {
    todoModel.displayUnfinishedTodos(function(err, data) {
        res.json(data);
    })
};

//Return all Todo items in JSON format
var displayAllTodos = function (req, res) {
    todoModel.displayAllTodos(function(err, data) {
        res.json(data);
    })
};

//Return all Todo items for a certain user in JSON format
var displayAllTodosForUser = function (req, res) {
    todoModel.displayAllTodosForUser(req.params.user_email, function(err, data) {
        res.json(data);
    })
};

//Return all unfinished Todo items for a certain user in JSON format
var displayAllUnfinishedTodosForUser = function (req, res) {
    todoModel.displayAllUnfinishedTodosForUser(req.params.user_email, function(err, data) {
        res.json(data);
    })
};

//Return a single item in JSON format with id
var getTodoById = function (req, res) {
    todoModel.getTodoById(req.params.todo_id, function(err, data) {
        res.json(data);
    })
};

//Add the current new Todo to todo database
//If no error, display the whole todo list
var addTodoItem = function (req, res) {
    var email = req.body.email;
    var newTodo = req.body.text;
    todoModel.addTodoItem(email, newTodo, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            todoModel.displayAllUnfinishedTodosForUser(email, function(err, data) {
                res.json(data);
            })
        }
    })
};

var createUser = function (req, res) {
    console.dir(req.body);
    userModel.createUser(req.body, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                res.json(data);
            })
        }
    })
};

//Updating a todo item
var editTodoItem = function (req, res) {
    todoModel.editTodoItem(req.params.todo_id, req.body, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            todoModel.displayUnfinishedTodos(function(err, data) {
                res.json(data);
            })
        }
    })
};

//Delete a todo with todo_id
//If no error, display the whole todo list
var deleteTodoItem = function (req, res) {

    todoModel.deleteTodoItem(req.params.todo_id, function(err, todo) {
        if (err)
            res.send(err);
        todoModel.displayUnfinishedTodos(function(err, data) {
            res.json(data);
        })
    })
};

var displayAllUsers = function (req, res) {
    userModel.displayAllUsers(function(err, data) {
        res.json(data);
    })
};

var addPomodoroTime = function (req, res) {
    todoModel.addPomodoroTime(req.params.pomodoro_id, req.params.new_time, function(err, data) {
        if (err) {
            res.send(err);
        }
    })
};

//Updating a user info settings
var editUser = function (req, res) {
    console.log(req.params.email);
    console.log(req.body);
    userModel.editUser(req.params.email, req.body, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Updating a user's happiness settings
//req.body.trackHappiness is the new happiness tracking field, true of false
//$http.post('/api/setHappinessSetting/Summer', {trackHappiness: false})
var editUserHappinessSetting = function (req, res) {
    userModel.editUserHappinessSetting(req.params.username, req.body.trackHappiness, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("req.body for setHappinessSetting API:" + JSON.stringify(req.body.trackHappiness));
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Updating a user's stress settings
//req.body.trackStress is the new stress tracking field, true of false
//$http.post('/api/setStressSetting/Summer', {trackStress: false})
var editUserStressSetting = function (req, res) {
    userModel.editUserStressSetting(req.params.username, req.body.trackStress, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Updating a user's Pomodoro settings
//req.body.trackPomodoro is the new Pomodoro tracking field, true of false
//$http.post('/api/setPomodoroSetting/Summer', {trackPomodoro: false})
var editUserPomodoroSetting = function (req, res) {
    userModel.editUserPomodoroSetting(req.params.username, req.body.trackPomodoro, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Updating a user's Todo settings
//req.body.trackTodo is the new Todo tracking field, true of false
//$http.post('/api/setTodoSetting/Summer', {trackTodo: false})
var editUserTodoSetting = function (req, res) {
    userModel.editUserTodoSetting(req.params.username, req.body.trackTodo, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Updating a user's PopupFrequency settings
//req.body.popupFrequency is the new PopupFrequency field, a string, for example, "1h" means every hour
//$http.post('/api/setPopupFrequency/Summer', {popupFrequency: "4h"})
var editUserPopupFrequency = function (req, res) {
    console.log(req.body.popupFrequency);
    userModel.editUserPopupFrequency(req.params.email, req.body.popupFrequency, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                console.log("User posting success");
                res.json(data);
            })
        }
    })
};

//Adding a stressPoint dictionary {time:, stressLevel:} to user's stress record
var addUserStressPoint = function (req, res) {
    newStressPoint = req.body.stressLevel;
    userModel.addUserStressPoint(req.params.email, newStressPoint, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                res.json(data);
            })
        }
    })
};

//Adding a happinessPoint dictionary {time:, happinessLevel:} to user's happiness record
var addUserHappinessPoint = function (req, res) {
    console.log("display req body in routes " + JSON.stringify(req.body));
    newHappinessPoint = req.body.happinessLevel;
    console.log("newHappinessPoint is in routes " + newHappinessPoint);
    userModel.addUserHappinessPoint(req.params.email, newHappinessPoint, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            userModel.displayAllUsers(function(err, data) {
                res.json(data);
            })
        }
    })
};

//Return a single user item in JSON format with email
var getUserByEmail = function (req, res) {
    userModel.getUserByEmail(req.params.email, function(err, data) {
        res.json(data);
    })
};

//Return the boolean value if certain email exists
var doesUserExist = function (req, res) {
    userModel.doesUserExist(req.params.email, function(err, data) {
        res.json(data);
    })
};

var routes = {
    displayUnfinishedTodos: displayUnfinishedTodos,
    displayAllTodos: displayAllTodos,
    displayAllTodosForUser: displayAllTodosForUser,
    displayAllUnfinishedTodosForUser: displayAllUnfinishedTodosForUser,

    getTodoById: getTodoById,
    addTodoItem: addTodoItem,
    createUser: createUser,
    editTodoItem: editTodoItem,
    deleteTodoItem: deleteTodoItem,
    displayAllUsers: displayAllUsers,
    addPomodoroTime: addPomodoroTime,

    editUser: editUser,
    editUserHappinessSetting: editUserHappinessSetting,
    editUserStressSetting: editUserStressSetting,
    editUserPomodoroSetting: editUserPomodoroSetting,
    editUserTodoSetting: editUserTodoSetting,
    editUserPopupFrequency: editUserPopupFrequency,
    
    addUserStressPoint: addUserStressPoint,
    addUserHappinessPoint: addUserHappinessPoint,
    getUserByEmail: getUserByEmail,
    doesUserExist: doesUserExist
};

module.exports = routes;