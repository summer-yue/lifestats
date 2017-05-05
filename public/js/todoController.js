//Controller for public/todo.html 

app.controller('todoController', ['$scope', '$http', '$window',
    function($scope, $http, $window) {

        $scope.rating = 0;
        $scope.ratingsProd = [{
            current: 3,
            max: 5,
            name: 'Productivity'
        }];

        $scope.ratingsStress = [{
            current: 3,
            max: 5, 
            name: 'Stress'
        }];

        $scope.ratingsHappy = [{
            current: 3,
            max: 5,
            name: 'Happiness'
        }];

        $scope.setProductivity = function(rating) {
            console.log(rating);
            $scope.lastTodo.productivity = rating;
        }

        $scope.setHappiness = function(rating) {
            console.log(rating);
            $scope.lastTodo.happiness = rating;
        }

        $scope.setStress = function(rating) {
            console.log(rating);
            $scope.lastTodo.stress = rating;
        }

        $scope.currrentUser = JSON.parse(localStorage.getItem("currentUser"));
        $scope.addFormData = {};
        $scope.idForModal = null; //The id for the current Todo item the user is editing, set when user clicks on todo text
        $scope.idForTagModal = null; //The id for Add Tag Button
        $scope.currentTodo = {}; //updated whenever showModal is called
        $scope.showPopup = false; //Showing a popup asking users to rank productivity and number of hours worked on a project
        $scope.lastTodo = {}; //records the last ToDo user completed
        $scope.alltags = ['Work', 'Social', 'Other'];

        // when landing on the page, get all todos and show them
        $http.get('/api/allUnfinishedTodos/' + $scope.currrentUser.email)
            .then(function(data) {
                $scope.todos = data.data;
            });

        $scope.showModal = function(idForModal) {
            $scope.idForModal = idForModal;
            $http.get('/api/todo/' + $scope.idForModal, $scope.currentTodo)
                .then(function(data) {
                    $scope.currentTodo = data.data[0];
                    console.log("updating currentTodo to:" + JSON.stringify($scope.currentTodo));
                });
            console.log("showModal is called, idForModal is:" + $scope.idForModal);
        }

        $scope.showTagModal = function(idForTagModal) {
            $scope.idForTagModal = idForTagModal;
            $http.get('/api/todo/' + $scope.idForTagModal, $scope.currentTodo)
                .then(function(data) {
                    $scope.currentTodo = data.data[0];
                    console.log("updating currentTodo to:" + JSON.stringify($scope.currentTodo));
                });
            console.log("showModal is called, idForTagModal is:" + $scope.idForTagModal);
        }

        // when submitting the add form, send the text to the node API
        $scope.createTodo = function() {
            var addedTodoItem = $scope.addFormData;
            console.log(addedTodoItem.text);
            if ((Object.keys(addedTodoItem).length === 0) ||
                (addedTodoItem.text.replace(/\s/g, '') === "")) {
                //Do not submit the form because an empty todo cannot be created
            } else {
                $scope.addFormData.email = JSON.parse(localStorage.getItem("currentUser")).email;

                $http.post('/api/addTodos', $scope.addFormData)
                    .then(function(data) {
                        $scope.addFormData = {}; // clear the form so our user is ready to enter another
                        $scope.todos = data.data;
                    });
            }

        };

        // Within the modal, the user can edit the todo text
        $scope.editTodo = function() {
            $http.post('/api/updateTodos/' + $scope.idForModal, $scope.currentTodo)
                .then(function(data) {
                    console.log("successfully edit todo to " + JSON.stringify($scope.currentTodo));
                });

            $scope.idForModal = null;
            $scope.currentTodo = {};
            //Refreshing the page
            window.location.reload();
        };

         // Within the modal, the user can add Tags
        $scope.addTag = function() {
            $http.post('/api/updateTodos/' + $scope.idForTagModal, $scope.currentTodo)
                .then(function(data) {
                    console.log("successfully edit todo to " + JSON.stringify($scope.currentTodo));
                });

            $scope.idForModal = null;
            $scope.currentTodo = {};
            //Refreshing the page
            window.location.reload();
        };

        // delete a todo after checking it
        $scope.deleteTodo = function(id) {
            //Updating lastTodo
            $http.get('/api/todo/' + id, $scope.lastTodo)
                .then(function(data) {
                    $scope.lastTodo = data.data[0];

                    //Updating done field in database
                    $scope.lastTodo.done = true;
                    $scope.lastTodo.finishedTime = new Date();
                    console.log("Updating done to true:" + JSON.stringify($scope.lastTodo));
                    $http.post('/api/updateTodos/' + id, $scope.lastTodo)
                        .then(function(data) {
                            console.log("successfully update todo to " + JSON.stringify($scope.lastTodo));
                        })

                    //Showing popup for user to rank productivity
                    $scope.showPopup = true;
                });
        };

        $scope.deleteTodoWithRefresh = function(id) {
            $scope.deleteTodo(id);
            window.location.reload();
        }

        //Hiding the edit Modal
        $scope.hideModal = function() {
            $scope.idForModal = null;
            $scope.currentTodo = {};
        }

        //Hiding the Tag Modal
        $scope.hideTagModal = function() {
            $scope.idTagForModal = null;
            $scope.currentTodo = {};
        }

        //Hiding the feedback modal
        $scope.hidePopup = function() {
            $scope.showPopup = false;
        }

        $scope.recordPopup = function() {
            //Hours has to be filled
            if (($scope.lastTodo.hours === undefined) || ($scope.lastTodo.hours === "")) {
                $window.alert("Please fill in the number of hours it took you for the task");
            } else {
                //Updating the lastTodo with new productivity and hours
                $http.post('/api/updateTodos/' + $scope.lastTodo._id, $scope.lastTodo)
                    .then(function(data) {
                        console.log("successfully update todo producivity to " + JSON.stringify($scope.lastTodo.productivity));
                        console.log("successfully update todo happiness to " + JSON.stringify($scope.lastTodo.happiness));
                        console.log("successfully update todo stress to " + JSON.stringify($scope.lastTodo.stress));
                    });
                //Refresh
                window.location.reload();
            }
        }
    }
 ]);
