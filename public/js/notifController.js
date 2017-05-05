// controller for public/notif.html
app.controller('notifController', ['$scope', '$interval', '$http', 'TimerService',
    function($scope, $interval, $http, TimerService) {
        TimerService.countdown(setCurrTime);

        function setCurrTime() {
            $scope.currTime = TimerService.getTimer();
            $scope.showNotif = true;
        }
    }
]);
