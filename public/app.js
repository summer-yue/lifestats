// main angular app that our entire application runs on

var app = angular.module('myApp', []);

app.service('TimerService', ['$http', '$interval', '$rootScope', function($http, $interval, $rootScope) {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));

    var interval;
    var seconds;
    var scope = $rootScope.$new();

    $rootScope.currentHappinessRating = 3;
    $rootScope.currentStressRating = 3;
    $rootScope.ifTrackHappiness;
    $rootScope.ifTrackStress;
    $rootScope.ifNotif;

    $rootScope.ratingsStress = [{
            current: 3,
            max: 5, 
            name: 'Stress'
        }];

    $rootScope.ratingsHappy = [{
        current: 3,
        max: 5,
        name: 'Happiness'
    }];

    //Record Happiness Point for this moment for user from notif
    $rootScope.setHappiness = function(rating) {
        console.log(currentUser.email);
        $rootScope.currentHappinessRating = rating;
       
        console.log("calling setHappiness");
    }

    //Record Stress Point for this moment for user from notif
    $rootScope.setStress = function(rating) {
        $rootScope.currentStressRating = rating;
    }

    $rootScope.recordNotif = function() {
        newStressPoint = { "time": new Date(), "stressLevel": $rootScope.currentStressRating };
        newHappinessPoint = { "time": new Date(), "happinessLevel": $rootScope.currentHappinessRating };

        $http.post('/api/addUserStressPoint/' + currentUser.email, newStressPoint)
        .then(
            function(data) {
                console.log('successfully adding stressPoint');
            },
            function(data) {
                console.log("error")
            });

        $http.post('/api/addUserHappinessPoint/' + currentUser.email, newHappinessPoint)
        .then(function(data) {
            console.log('successfully adding stressPoint');
        }, function(data) {
            console.log("error")
        });
        window.location.reload();        
    }

    $http.get('/api/user/' + currentUser.email)
        .then(function(data) {
            console.log(data)
            $rootScope.ifTrackHappiness = data.data.trackHappiness;
            $rootScope.ifTrackStress = data.data.trackStress;
            $rootScope.ifNotif = $rootScope.ifTrackHappiness || $rootScope.ifTrackStress;
        });

    this.countdown = function(callback) {
        console.log('calling countdown')
        $http.get('/api/user/' + currentUser.email)
            .then(function(data) {
                seconds = parseInt(data.data.popupFrequency) * 60 * 60;
            });

        interval = $interval(function() {
            if (seconds == 0) {
                scope.stop();
                callback();
                seconds = 10;
            } else {
                seconds--;
                console.log('curr: ' + seconds);
            }
        }, 1000);

    };

    scope.stop = function() {
        if (angular.isDefined(interval)) {
            $interval.cancel(interval);
            interval = undefined;
        }
    };

    scope.$on('$destroy', function() {
        this.stop();
    });

    this.getTimer = function() {
        return seconds;
    };
}]);

// directive inserted in every page for notif.html
app.directive('notif', function() {
    return {
        templateUrl: 'notif.html',
        controller: 'notifController'
    };
})

// directive for star rating
app.directive('starRating', function() {
        return {
            restrict: 'A',
            template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
            scope: {
                ratingValue: '=',
                max: '=',
                onRatingSelected: '&'
            },
            link: function(scope, elem, attrs) {

                var updateStars = function() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };

                scope.$watch('ratingValue', function(oldVal, newVal) {
                    if (newVal) {
                        updateStars();
                    }
                });
            }
        }
    });
