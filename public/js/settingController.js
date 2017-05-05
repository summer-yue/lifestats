//Controller for public/settings.html

app.controller('settingController', ['$scope', '$http',
    function($scope, $http) {
        $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
        $scope.submitSettings = function() {
            $scope.successTextAlert = "You've updated your settings at " + new Date();
            $http.post('/api/updateUsers/' + $scope.currentUser.email, $scope.currentUser)
                .then(function(data) {
                    $scope.showSuccessAlert = true;
                    localStorage.currentUser = JSON.stringify($scope.currentUser);
                })
        };
    }
])
