//Major APIs dealing with user database

// define and initialize the model =================
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	email : String,
	username: String,
	joinedTime: Date,

    trackHappiness : Boolean,
    trackStress : Boolean,
    trackPomodoro : Boolean,
    trackTodo : Boolean,
    popupFrequency : String, //# of hours per popup

    happinessData : [{"time": Date, "happinessLevel": Number}],
    stressData: [{"time": Date, "stressLevel": Number}], //dict format array of dictionaries of {time:, stressLevel:} recorded for the user
	
	age : Number,
    lang : String,
    id_token : String,
    id : String,
    img : String,
});

var UserDB = mongoose.model('Users', userSchema);

//Initialize the user database with one single user
var initializeUser= function() {
	UserDB.remove(function(err){
	    if (err) {
	    	console.log("Error in dropping User DB:" + err)
	    }
	});

	UserDB.create({
				username: "Yuting Yue",
				joinedTime: new Date(),
				trackHappiness : true,
			    trackStress : true,
			    trackPomodoro : true,
			    trackTodo : true,
			    popupFrequency : "2",

			    happinessData: [{"time": new Date() - 30000, "happinessLevel": 4}, 
			    							   {"time": new Date(), "happinessLevel": 5}],
			    stressData: [{"time": new Date() - 30000, "stressLevel": 3}, 
			    							   {"time": new Date(), "stressLevel": 2}],
				img_url: "sample_img",
				id_token: "sample_id_token",
				age : 21,
			    lang : "en",
			    email : "julio@jul.io",
			    id : "350",
			    img : "http://lifestats.ml", 
			}, function(err, user) {
				console.log(user);
			}
	);
}

//Update the existing user with email to newUser
var editUser = function(email, newUser, route_callbck) {
	UserDB.update({
			email: email
		}, 
		newUser,
		function(err, user) {
			if (err) {
				console.log("Fail to update user in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUser to" + JSON.stringify(newUser));
				route_callbck(null, user);
			}
	});
}

//Adding a stressPoint dictionary {time:stressLevel} to user's stress record
var addUserStressPoint = function(email, stressPoint, route_callbck) {
	stressEntry = {"time": new Date(), "stressLevel": stressPoint};
	UserDB.find({email: email}, function(err, user) {
		if (err) {
			console.log("Failed to get " + email + " user in server:" + err);
		}

		if (user[0] == undefined) {
			console.log("Failed to get " + email + " user in server because of undefined user");
		} else {
		
			stressData = user[0].stressData;
			stressData.push(stressEntry);

			UserDB.update({
					email: email 
				}, 
				{stressData: stressData},
				function(err, user) {
					if (err) {
						console.log("Fail to add User Stress Point in server:" + email);
						route_callbck(err, null);
					} else {
						route_callbck(null, user);
					}
			});
		}
		
	});
}

//Adding a happinessPoint dictionary {time:happinessLevel} to user's happiness record
var addUserHappinessPoint = function(email, happinessPoint, route_callbck) {
	happinessEntry = {"time": new Date(), "happinessLevel": happinessPoint};
	UserDB.find({email: email}, function(err, user) {
		if (err) {
			console.log("Failed to get " + email + " user in server:" + err);
		}

		if (user[0] == undefined) {
			console.log("Failed to get " + email + " user in server because of undefined user");
		} else {
		
			happinessData = user[0].happinessData;
			happinessData.push(happinessEntry);

			UserDB.update({
					email: email 
				}, 
				{happinessData: happinessData},
				function(err, user) {
					if (err) {
						console.log("Fail to add User Happiness Point in server:" + email);
						route_callbck(err, null);
					} else {
						route_callbck(null, user);
					}
			});
		}
		
	});
}

//Update the happiness field of existing user with userName
var editUserHappinessSetting = function(userName, newHappinessSetting, route_callbck) {
	UserDB.update({
			username: userName
		}, 
		{trackHappiness: newHappinessSetting},
		function(err, user) {
			if (err) {
				console.log("Fail to update user happiness in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUserHappinessSetting");
				route_callbck(null, user);
			}
	});
}

//Update the stress field of existing user with userName
var editUserStressSetting = function(userName, newStressSetting, route_callbck) {
	UserDB.update({
			username: userName
		}, 
		{trackStress: newStressSetting},
		function(err, user) {
			if (err) {
				console.log("Fail to update user stress in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUserStressSetting");
				route_callbck(null, user);
			}
	});
}

//Update the Pomodoro field of existing user with userName
var editUserPomodoroSetting = function(userName, newPomodoroSetting, route_callbck) {
	UserDB.update({
			username: userName
		}, 
		{trackPomodoro: newPomodoroSetting},
		function(err, user) {
			if (err) {
				console.log("Fail to update user Pomodoro in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUserPomodoroSetting");
				route_callbck(null, user);
			}
	});
}

//Update the Todo field of existing user with userName
var editUserTodoSetting = function(userName, newTodoSetting, route_callbck) {
	UserDB.update({
			username: userName
		}, 
		{trackTodo: newTodoSetting},
		function(err, user) {
			if (err) {
				console.log("Fail to update user Todo in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUserTodoSetting");
				route_callbck(null, user);
			}
	});
}

//Update the PopupFrequency field of existing user with userName
var editUserPopupFrequency = function(userName, newPopupFrequency, route_callbck) {
	UserDB.update({
			username: userName
		}, 
		{popupFrequency: newPopupFrequency},
		function(err, user) {
			if (err) {
				console.log("Fail to update user PopupFrequency in server:" + userName);
				route_callbck(err, null);
			} else {
				console.log("Successfully editUserPopupFrequency");
				route_callbck(null, user);
			}
	});
}

//Return (err, lise of all users) to callback function
var displayAllUsers = function(route_callbck) {
	UserDB.find(function(err, users) {
		if (err) {
			console.log("Failed to get all users in server:" + err);
		}
		route_callbck (err, users);
	});
}

var getUserByEmail = function(email, route_callbck) {
	UserDB.find({email: email}, function(err, user) {
		if (err) {
			console.log("Failed to get " + email + " user in server:" + err);
		}
		route_callbck (err, user[0]);
	});
}

//Add a new user to the todo database
//Return the err message or the newly added todo item to callback function
var createUser = function(userObject, route_callbck) {
	console.log("userObject:" + userObject.username);

	UserDB.create({
			username: userObject.username,
			age: userObject.age,
			lang: userObject.lang,
			email: userObject.email,
			id: userObject.id,
			img: userObject.img,
			joinedTime: new Date(),

			stressData: new Array(),
			happinessData: new Array(),

			trackHappiness : userObject.trackHappiness,
		    trackStress : userObject.trackStress,
		    trackPomodoro : userObject.trackPomodoro,
		    trackTodo : userObject.trackTodo,
		    popupFrequency : userObject.popupFrequency, //# of hours per popup
		},
		function (err, user) {
			if (err) {
				route_callbck(err, null);
			}
			route_callbck(null, user);
	});
}

//check if user's email address is already in the database
var doesUserExist = function(email, route_callbck) {
	UserDB.find({email: email}, function(err, user) {
		if (err) {
			console.log("Failed to get " + email + " user in server doesUserExist:" + err);
		}
		route_callbck (err, user.length != 0);
	});
}

var userModule = { 
  initializeUser: initializeUser,
  displayAllUsers: displayAllUsers,
  editUser: editUser,
  editUserHappinessSetting: editUserHappinessSetting,
  editUserStressSetting: editUserStressSetting,
  editUserPomodoroSetting: editUserPomodoroSetting,
  editUserTodoSetting: editUserTodoSetting,
  editUserPopupFrequency: editUserPopupFrequency,
  addUserStressPoint: addUserStressPoint,
  addUserHappinessPoint: addUserHappinessPoint,
  getUserByEmail: getUserByEmail,
  createUser: createUser,
  doesUserExist: doesUserExist
};

module.exports = userModule;