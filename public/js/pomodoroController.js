//Controller for public/pomodoro.html 

app.controller('pomodoroController', ['$scope', '$interval', '$http', '$window',
    function($scope, $interval, $http, $window) {

        // pomodoro timer visualization
        var options = {
            height: 500, // height of viz
            width: 500, // width of viz (since a circle both are equal)
            start: {
                fill: '#FE556A',
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            },
            finish: {
                fill: '#FE556A',
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            }
        };

        var data = [{
            dataName: "shadow",
            update: function(d, dash) {},
            start: {
                angle: 1,
                fill: '#eee',
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            },
            finish: {
                angle: 0,
                fill: '#eee',
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            },
            immediate: {
                angle: true,
            }
        }, {
            dataName: "main",
            values: {
                show: true
            },
            start: {
                value: 100,
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            },
            finish: {
                value: 0,
                innerRatio: .76, // diameter of inner circle relative to height
                outerRatio: .95, // diameter of outer circle relative to height
            },
            callback: function(d, a, t) {
                console.log('timer:' + a.getControl().name + ' series:' + d.dataName + ' step:' + t + ' progress:' + a.getProgress());
            }
        }];

        // this is how to initializd and set data
        var an = new DashTimer('#timer1')
            .init(options)
            .setData(data)
            // pomodoro timer visualization ends

        $scope.selectedTask = {};
        $scope.startedMin = 25;
        $scope.min = 24;
        $scope.sec = 59;
        $scope.minBreak = 4;
        $scope.secBreak = 59;
        $scope.showPopup = false;
        $scope.isBreak = false;
        $scope.showNotif = false;
        $scope.showCompletePopup = false;
        $scope.showModal = true;
        $scope.disableEdit = false;
        var interval;
        var breakInterval;

        // retrieve all todos from database
        $http.get('/api/todos')
            .then(function(data) {
                $scope.taskList = data;
                $scope.hasTodos = true;

                if (data.data.length == 0) {
                    $scope.hasTodos = false;
                }
            });

        // watch the values from textbox in view
        $scope.changedValue = function(val) {
            selectedTask = val;
        };

        $scope.changedMin = function(val) {
            min = val;
        };

        $scope.changedSec = function(val) {
            sec = val;
        };

        // called when start button clicked 
        $scope.start = function() {
            $scope.disableEdit = true;
            $scope.startedMin = $scope.min;
            console.log("started min" + $scope.startedMin);
            if (angular.isDefined(interval)) return;

            interval = $interval(function() {
                if ($scope.sec == 0 && $scope.min == 0) {
                    $scope.startBreak();
                } else if ($scope.sec > 0 && $scope.min > 0) {
                    $scope.sec--;
                } else if ($scope.min > 0 && $scope.sec == 0) {
                    $scope.min--;
                    $scope.sec = 59;
                } else {
                    $scope.sec--;
                }
            }, 1000);

            if (an.isPaused()) {
                an.resume();
            } else {
                var countdown = $scope.min * 60 + $scope.sec;
                data[1].start.value = countdown;
                an.setData(data);

                an.start(countdown * 1000).then(function(anarcs) {
                    report(true, anarcs);
                }, function(anarcs) {
                    report(false, anarcs);
                });
            }
        };

        $scope.startBreak = function() {
            console.log("starting break");
            if (angular.isDefined(breakInterval)) return;
            breakInterval = $interval(function() {
                if ($scope.secBreak == 0 && $scope.minBreak == 0) {
                    $scope.stop();
                    $scope.playAudio();
                    $scope.showPopup = true;
                } else if ($scope.secBreak > 0 && $scope.minBreak > 0) {
                    $scope.secBreak--;
                } else if ($scope.minBreak > 0 && $scope.secBreak == 0) {
                    $scope.minBreak--;
                    $scope.secBreak = 59;
                } else {
                    $scope.secBreak--;
                }
            }, 1000);

            an.start(0).then(function(anarcs) {
                report(true, anarcs);
            }, function(anarcs) {
                report(false, anarcs);
            });
            an.pause();
        };

        $scope.stop = function() {
            $scope.disableEdit = false;
            if (angular.isDefined(breakInterval)) {
                $interval.cancel(breakInterval);
                breakInterval = undefined;
            }

            if (angular.isDefined(interval)) {
                $interval.cancel(interval);
                interval = undefined;
            }
            if (!an.isPaused()) {
                an.pause();
            }
        };

        $scope.reset = function() {
            $scope.min = 24;
            $scope.sec = 59;
            $scope.minBreak = 4;
            $scope.secBreak = 59;
            $scope.showPopup = false;

            var countdown = $scope.min * 60 + $scope.sec;
            data[1].start.value = countdown;
            an.setData(data);

            if (an.isPaused()) {

                an.start(countdown * 1000).then(function(anarcs) {
                    report(true, anarcs);
                }, function(anarcs) {
                    report(false, anarcs);
                });
                an.pause();
            } else {

                an.start(countdown * 1000).then(function(anarcs) {
                    report(true, anarcs);
                }, function(anarcs) {
                    report(false, anarcs);
                });
            }
        };

        $scope.$on('$destroy', function() {
            $scope.stop();
        });

        $scope.recordPopup = function() {
            console.log(JSON.stringify($scope.selectedTask.name._id));
            console.log(JSON.stringify($scope.startedMin));
            console.log(JSON.stringify($scope.min));

            $scope.numInString = ($scope.startedMin - $scope.min + 1 + $scope.selectedTask.name.time).toString();
            console.log($scope.numInString + "session time");
            $http.post('/api/addPomodoroTime/' + $scope.selectedTask.name._id + '/' + $scope.numInString, $scope.selectedTask.name)
                .then(function(data) {
                    console.log("successfully update pomodoro task time to " + JSON.stringify($scope.selectedTask.name.time));
                });

        }

        // task completed either due to time runs out or complete button click
        $scope.complete = function() {
            console.log("task is:" + JSON.stringify($scope.selectedTask));
            $http.delete('/api/deleteTodos/' + $scope.selectedTask.name._id)
                .then(function(data) {
                    console.log("successfully delete todo when pomodoro popup marked as complete");
                })
            $scope.stop();
            if ($scope.taskList.length == 0) {
                $scope.showAddMorePopup = true;
            }

            $scope.showCompletePopup = true;
        };


        $scope.redirect = function() {
            window.location = "/todo.html";

        };

        $scope.playAudio = function() {
            var audio = new Audio('sound/alert.mp3');
            audio.play();
        };

        $scope.closeModal = function() {
            $scope.showModal = false;
        };

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
            $scope.selectedTask.productivity = rating;
        }

        $scope.setHappiness = function(rating) {
            console.log(rating);
            $scope.selectedTask.happiness = rating;
        }

        $scope.setStress = function(rating) {
            console.log(rating);
            $scope.selectedTask.stress = rating;
        }

        $scope.recordCompletePopup = function() {
            //Hours has to be filled
            if (($scope.selectedTask.hours === undefined) || ($scope.selectedTask.hours === "")) {
                $window.alert("Please fill in the number of hours it took you for the task");
            } else {
                //Updating the lastTodo with new productivity and hours
                $http.post('/api/updateTodos/' + $scope.selectedTask._id, $scope.selectedTask)
                    .then(function(data) {
                        console.log("successfully update todo happiness to " + JSON.stringify($scope.selectedTask.happiness));
                        console.log("successfully update todo stress to " + JSON.stringify($scope.selectedTask.stress));
                    });
                //Refresh
                window.location.reload();
            }
        }

    }
]);
