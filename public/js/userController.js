// controller for anything user related (e.g. login, settings, etc.)

app.controller('mainUserController', ['$scope', '$http', '$route',
    function($scope, $http, $route) {
    // This flag we use to show or hide the button in our HTML.
    $scope.signedIn = false;
    $scope.userImg = {};
    $scope.displayUser = "none";
    $scope.displayLoginButton = "block";
    $scope.userName;
    $scope.currentUser = {};
    $scope.successTextAlert = "You've updated your settings at " + new Date();

    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        console.log("start called");
        $scope.renderSignInButton();
    };

    // Render the sign in button.
    $scope.renderSignInButton = function() {
        console.log("renderSignInButton called");
        gapi.signin.render('signInButton',
            {
                'callback': $scope.signInCallback, // Function handling the callback.
                'clientid': '659758037057-afohj28tbl3ofjvkem042t7nt43rhcd5', // CLIENT_ID from developer console which has been explained earlier.
                'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                                  // as their explanation is available in Google+ API Documentation.
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                'cookiepolicy': 'single_host_origin'
            }
        );
    }

    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        console.log("signInCallBack called");
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.processAuth(authResult);
            });
        }, 0);
    };
 
    // Here we do the authentication processing and error handling.
    // Note that authResult is a JSON object.
    $scope.processAuth = function(authResult) {
        console.log("processAuth called");
        // Do a check if authentication has been successful.
        if(authResult['access_token']) {
            // Successful sign in.
            $scope.signedIn = true;
            $scope.getUserInfo();
        } else if(authResult['error']) {
            // Error while signing in.
            $scope.signedIn = false;
            $scope.displayUser = "none";
            $scope.displayLoginButton = "block";
            // Report error.
        }
    };

    // Request user info.
    $scope.getUserInfo = function() {
        console.log("getUserInfo called");
        gapi.client.request(
            {
                'path':'/plus/v1/people/me',
                'method':'GET',
                'callback': $scope.userInfoCallback
            }
        );
    };

    // When callback is received, process user info.
    $scope.userInfoCallback = function(userInfo) {
        console.log("userInfoCallback called");
        $scope.$apply(function() {
            $scope.processUserInfo(userInfo);
        });
    };
 
    // Process user info.
    // userInfo is a JSON object.
    $scope.processUserInfo = function(userInfo) {
        console.log("User Email: " + userInfo['emails'][0].value);
        //console.log("User age: " + userInfo['ageRange'].min);
        console.log("User: " + userInfo['displayName']);
        console.log("Language: " + userInfo['language']);
        console.log("UserID: " + userInfo['id']);
        console.log("Gender: " + userInfo['gender']);

        $scope.displayLoginButton = "none";
        $scope.userImg = userInfo['image'].url + "1";
        $scope.displayUser = "block";
        $scope.userName = userInfo['displayName'];
        console.log("User Image URL: " + userInfo['image'].url + "1");

        var userObject = new Object();
        userObject.username = userInfo['displayName'];
        //userObject.age  = userInfo['ageRange'].min;
        userObject.gender = userInfo['gender'];
        userObject.lang = userInfo['language'];
        userObject.email = userInfo['emails'][0].value;
        userObject.id = userInfo['id'];
        userObject.img = userInfo['image'].url

        $scope.createUser(userObject);
    }

        // when logging in, add your profile to database if email does not already exists
    $scope.createUser = function(user) {

        var doesUserExist = false;

        //Default settings
        user.trackHappiness = true;
        user.trackStress = true;
        user.trackPomodoro = true;
        user.trackTodo = true;
        user.popupFrequency = "2";
        localStorage.currentUser = JSON.stringify(user);
        console.log("set default settings");

        $http.get('/api/userExists/' + user.email, doesUserExist)
             .success(function(data) {
                doesUserExist = JSON.parse(data);
                console.log("value of doesUserExist:" + doesUserExist);
                if (doesUserExist == true) {} 
                else {
                    console.log("Creating User: " + JSON.stringify(user));
                    $http.post('/api/addUser', user)
                        .success(function(data) {
                            $scope.currentUser = data;
                        })
                        .error(function(data) {
                            console.log('Error from user.js in creating new user item: ' + data);
                        });
                }
            })
            .error(function(data) {
                console.log('Error from user.js in creating new todo item: ' + data);
            });
    };

    $scope.logout = function() {
        localStorage.removeItem("currentUser");
        gapi.auth.signOut();
    };

    // Call start function on load.
    $scope.start();

    // when landing on the page, get all todos and show them
    $http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
        })
        .error(function(data) {
            console.log('Error from users.js in getting todo lists: ' + data);
        });
}
])

angular.bootstrap(document.getElementById("loginModule"), ['myApp']);
