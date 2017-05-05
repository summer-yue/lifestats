// server.js is the main backend file that starts this node application

//set up
var mongoose = require('mongoose');
var todoModel = require('./models/todo.js');
var userModel = require('./models/user.js');

var express = require('express');
var app = express();

var routes = require('./routes.js');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//configuration
mongoose.connect('mongodb://localhost/lifestats');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Initialize Mongo models
todoModel.initializeTodo();
userModel.initializeUser();

db.once('open', function() {
    //Return unfinished Todo items in JSON format
    app.get('/api/todos', routes.displayUnfinishedTodos);

    //Return all Todo items in JSON format
    app.get('/api/allTodos', routes.displayAllTodos);

    //Return all Todo items for a certain user in JSON format
    app.get('/api/allTodos/:user_email', routes.displayAllTodosForUser);

    //Return all unfinished Todo items for a certain user in JSON format
    app.get('/api/allUnfinishedTodos/:user_email', routes.displayAllUnfinishedTodosForUser);

    //Return a single item in JSON format with id
    app.get('/api/todo/:todo_id', routes.getTodoById);

    //Add the current new Todo to todo database
    //If no error, display the whole todo list
    app.post('/api/addTodos', routes.addTodoItem);

    //Add new user to the database
    app.post('/api/addUser', routes.createUser);

    //Updating a todo item
    app.post('/api/updateTodos/:todo_id', routes.editTodoItem);

    //Delete a todo with todo_id
    //If no error, display the whole todo list
    app.delete('/api/deleteTodos/:todo_id', routes.deleteTodoItem);

    //Display all users that have ever used the app after it started
    app.get('/api/users', routes.displayAllUsers);

    app.post('/api/addPomodoroTime/:pomodoro_id/:new_time', routes.addPomodoroTime);

    //Updating a user info settings
    app.post('/api/updateUsers/:email', routes.editUser);

    //Updating a user's happiness settings
    //req.body.trackHappiness is the new happiness tracking field, true of false
    //$http.post('/api/setHappinessSetting/Summer', {trackHappiness: false})
    app.post('/api/setHappinessSetting/:username', routes.editUserHappinessSetting);

    //Updating a user's stress settings
    //req.body.trackStress is the new stress tracking field, true of false
    app.post('/api/setStressSetting/:username', routes.editUserStressSetting);

    //Updating a user's Pomodoro settings
    //req.body.trackPomodoro is the new Pomodoro tracking field, true of false
    app.post('/api/setPomodoroSetting/:username', routes.editUserPomodoroSetting);

    //Updating a user's Todo settings
    //req.body.trackTodo is the new Todo tracking field, true of false
    app.post('/api/setTodoSetting/:username', routes.editUserTodoSetting);

    //Updating a user's PopupFrequency settings
    //req.body.popupFrequency is the new PopupFrequency field, a string, for example, "1h" means every hour
    app.post('/api/setPopupFrequency/:email', routes.editUserPopupFrequency);

    //Adding a stressPoint dictionary {time:, stressLevel:} to user's stress record
    app.post('/api/addUserStressPoint/:email', routes.addUserStressPoint);

    //Adding a happinessPoint dictionary {time:, happinessLevel:} to user's happiness record
    app.post('/api/addUserHappinessPoint/:email', routes.addUserHappinessPoint);

    //Return a single user item in JSON format with email
    app.get('/api/user/:email', routes.getUserByEmail);
    //Return the boolean value if certain email exists
    app.get('/api/userExists/:email', routes.doesUserExist);

    app.get('/home', function(req, res) {
        res.sendfile('./public/homepage.html');
    });

    app.get('/pomodoro', function(req, res) {
        res.sendfile('./public/pomodoro.html');
    });

    app.get('/stats', function(req, res) {
        res.sendfile('./public/stats.html');
    });

    app.get('/settings', function(req, res) {
        res.sendfile('./public/settings.html');
    });

    app.get('/todo', function(req, res) {
        res.sendfile('./public/todo.html');
    });

    app.get('/happiness', function(req, res) {
        res.sendfile('./public/stats-html/happiness.html');
    });

    app.get('/stress', function(req, res) {
        res.sendfile('./public/stats-html/stress.html');
    });

    app.get('/productivity', function(req, res) {
        res.sendfile('./public/stats-html/productivity.html');
    });

    app.get('/compactTodo', function(req, res) {
        res.sendfile('./public/compact_todo.html');
    });
});

//Listen (start app with node server.js)
app.listen(8080);
console.log("LifeStats running on port 8080");
