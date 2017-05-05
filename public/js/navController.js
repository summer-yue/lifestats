//Controller for public/navigation.html 
app.controller('navController', ['$scope', '$http', '$window',
    function($scope, $location) {

	    console.log("Enter Nav Controller");
	    $scope.activePath = null;
	    $scope.test = Summer;

		$scope.$on('$routeChangeSuccess', function(){
			$scope.activePath = $location.path();
			console.log( $location.path() );
		});
    }

]);