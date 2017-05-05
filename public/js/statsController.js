//Controller for any stats content related


// load the visualization API and the linechart package.
google.charts.load('current', {
  packages: ['corechart']

});

// bootscraps the element with the app; 
// Once the package is loaded, we need to initialize our Angular app.
google.charts.setOnLoadCallback(function() {
  angular.bootstrap(document.body, ['myApp']);
});

// start the app module
// angular.module('myApp', [])
app.controller('statsController', ['$scope', '$http',
  function($scope, $http) {
    $scope.startDate = {};
    $scope.endDate = {};
    $scope.avgHappiness = 0;
    $scope.avgProductivity = 0;
    $scope.avgStress = 0;
    $scope.taskData = {};
    $scope.happyFace = ":("

    // get the email and name of the person
    var useremail = JSON.parse(localStorage.getItem("currentUser")).email;
    var name = JSON.parse(localStorage.getItem("currentUser")).username;

    // load start template values for getting the range (with today's date)
    // refresh the data
    $scope.load = function() {
      $scope.startDate.value = "2017-02-09";
      console.log(todayDate());
      $scope.endDate.value = todayDate();
      $scope.refresh();
    };

    // display the summary
    $scope.refreshChart = function(stat) {
      $http.get('/api/allTodos/' + useremail)
      // $http.get('/api/allTodos/billhebillhe@gmail.com') //hard-coded values
      .then(function(data) {
        console.log("refreshed data");
        $scope.taskData = data.data;
        // $scope.displayChart(stat);
        $scope.drawChart();
        // $scope.showFace();
      });
    }

    // draw the productivity pie chart
    $scope.drawChart = function() {
      var taskData = $scope.taskData;
      console.log(taskData);

      // parse and get the data from the input
      var taskArray = [];
      var time = [];

      taskData.forEach(function(item, index, array) {
        var hours = item.hours;
        if (typeof hours == 'undefined') {
          hours = 0;
        }
        item.tags.forEach(function(item, index, array) {
          var indexOf = taskArray.indexOf(item);
          if (indexOf == -1) {
            taskArray.push(item);
            time.push(hours);
            console.log(hours);
          } else {
            time[indexOf] = time[indexOf] + hours;
            console.log(hours);
          }
        });
      });

      console.log(taskArray);
      console.log(time);

      var tableData = [['Task', 'Hours per Day']];

      var count = 0;
      taskArray.forEach(function(item, index, array) {
        tableData.push([item, time[index]]);
      });

      if (taskArray.length == 0) {
        document.getElementById('donutchart').innerHTML = "You haven't completed any tasks with tags. Why don't you go <a href=\"/todo\">complete some</a>.";
        return;
      }


      var data = google.visualization.arrayToDataTable(tableData);

      var options = {
        title: 'Productivity Breakdown for ' + name,
        pieHole: 0.4,
        titleTextStyle: {fontName: 'Futura-Medium', bold: 'false', color: '4A4A4A'},
        backgroundColor: '#E7E7E7',
        width: 1200,
        height: 600,
        colors: ['28BE04', '3691FC', 'FE556A', 'FFD21D', 'AA48FF'],
        legend: {textStyle: {fontName: 'Futura-Medium'}}
      };

      var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
      chart.draw(data, options);
    }


    // provide methods for all stat pages to call
    $scope.displayAll = function() {
      $scope.display("all");
    }

    $scope.displayStress = function() {
      $scope.display("stress");
    }

    $scope.displayHappy = function() {
      $scope.display("happy");
    }

    $scope.displayProd = function() {
      $scope.display("prod");
    }

    $scope.showFace = function(){
      if (document.getElementById('taskCompletion') == null) {
        return;
      }
      console.log("showFace");
      var taskData = $scope.taskData;

      var today = new Date();
      var begin = new Date(today.getFullYear(), today.getMonth(), dd = today.getDate(), 0, 0, 0, 0);
      console.log(begin);

      var tasksBegan = 0;
      var done = 0;
      taskData.forEach(function(item, index, array) {
        console.log(item.createdTime);
        var createdTme = new Date(Date.parse(item.createdTime));
        
        if (createdTme > begin) {
          tasksBegan++;
          if (item.done) {
            done++;
          }
        }
      });

      console.log('1');

      if (tasksBegan == 0) {
        document.getElementById('taskCompletion').innerHTML = "You don't have any tasks today. Why don't you go <a href=\"/todo\">add some</a>.";
        return;
      }

      if (done/tasksBegan < 0.2) {
        $scope.happyFace = ":(";
      } else if (done/tasksBegan > 0.8) {
        $scope.happyFace = ":)";
      } else {
        $scope.happyFace = ":/";
      }

      console.log($scope.happyFace);
      
      document.getElementById('taskCompletion').innerHTML = 
        "You completed " + ((done/tasksBegan*100).toFixed(2)) + " % of Today's Tasks so far! ";

      //Happiness face image showing
      var imageSource = null;
      if ($scope.happyFace == ':(') {
        imageSource = '../img/sad.png';
      } else if ($scope.happyFace == ':/') {
        imageSource = '../img/normal.png';
      } else if ($scope.happyFace == ':)') {
        imageSource = '../img/happy.png';
      } else {
        console.log("Invalid value of happyFace in statsController");
      }
      console.log('<img src=\'' + imageSource +'\'>');
      document.getElementById('smileyFace').innerHTML =
        '<img src=\'' + imageSource +'\'>';

      console.log(done/tasksBegan + " % done!");
    }

    // display the summary
    $scope.refresh = function(stat) {
      $http.get('/api/allTodos/' + useremail)
      // $http.get('/api/allTodos/billhebillhe@gmail.com') //hard-coded values
      .then(function(data) {
        console.log("refreshed data");
        $scope.taskData = data.data;
        // $scope.displayChart(stat);
        // $scope.drawChart();
        $scope.showFace();
      });
    }

    // display the summary
    $scope.display = function(stat) {
      $http.get('/api/allTodos/' + useremail)
      // $http.get('/api/allTodos/billhebillhe@gmail.com') //hard-coded values
      .then(function(data) {
        console.log("displayed data");
        $scope.taskData = data.data;
        $scope.displayChart(stat);
      });
    }

    // display the charts
    $scope.displayChart = function(stat){

      var taskData = $scope.taskData;

      // if there is no data
      if (taskData.length == 0) {
        document.getElementById('chart').innerHTML = "<br> <br>You have not completed any tasks";
        return;
      }

      var len = 0;
      var data = new google.visualization.DataTable();
      var dataArray = [];
      var avgStress = 0;
      var avgHappiness = 0;
      var avgProductivity = 0;
      data.addColumn('datetime', 'Time');

      var options = {
        title: 'Happiness, Stress and Productivity tracking for ' + name,
        titleTextStyle: {fontName: 'Futura-Medium', bold: 'false', color: '4A4A4A'},
        hAxis: {title: 'Date',  titleTextStyle: {color: '#333', fontName: 'Futura-Medium'}},
        vAxis: {minValue: 0, maxValue: 5, fontName: 'Futura-Medium'},
        backgroundColor: '#E7E7E7',
        width: 1200,
        height: 600,
        colors: ['3691FC', 'FE556A', 'FFD21D'],
        legend: {textStyle: {fontName: 'Futura-Medium'}},
        lineWidth: 4
      };

      if (stat == "stress") {
        data.addColumn('number', 'Stress');      
        taskData.forEach(function(item, index, array) {
          if (item.done && typeof item.stress != 'undefined') {

            var array = [new Date(Date.parse(item.finishedTime)), item.stress];
            dataArray.push(array);
            avgStress += item.stress;
            len++;
          }
        })
        document.getElementById('avgStress').innerHTML = "The average stress is " + (avgStress/len).toFixed(2);
        options.title = "Stress tracking for " + name;
      }

      if (stat == "happy") {
        data.addColumn('number', 'Happiness');      
        taskData.forEach(function(item, index, array) {
          if (item.done && typeof item.happiness != 'undefined') {

            var array = [new Date(Date.parse(item.finishedTime)), item.happiness];
            dataArray.push(array);
            avgHappiness += item.happiness;
            len++;
          }
        })
        document.getElementById('avgHappiness').innerHTML = "The average happiness is " + (avgHappiness/len).toFixed(2);
        options.title = "Happiness tracking for " + name;
      }

      if (stat == "prod") {
        data.addColumn('number', 'Productivity');      
        taskData.forEach(function(item, index, array) {
          if (item.done && typeof item.productivity != 'undefined') {

            var array = [new Date(Date.parse(item.finishedTime)), item.productivity];
            dataArray.push(array);
            avgProductivity += item.productivity;
            len++;
          }
        })
        document.getElementById('avgProductivity').innerHTML = 
        "The average productivity is " + avgProductivity/len;
        options.title = "Productivity tracking for " + name;
      }

      if (stat == "all") {
        data.addColumn('number', 'Stress');
        data.addColumn('number', 'Happiness');
        data.addColumn('number', 'Productivity');
        taskData.forEach(function(item, index, array) {
          if (item.done && typeof item.stress != 'undefined'
                        && typeof item.happiness != 'undefined'
                        && typeof item.productivity != 'undefined') {

            var array = [new Date(Date.parse(item.finishedTime)), item.stress, item.happiness, item.productivity];
            dataArray.push(array);
            avgHappiness += item.happiness; 
            avgProductivity += item.productivity;
            avgStress += item.stress;
            len++;
          }
        })        
        document.getElementById('avgStress').innerHTML = "The average stress is " + (avgStress/len).toFixed(2);
        document.getElementById('avgHappiness').innerHTML = "The average happiness is " + (avgHappiness/len).toFixed(2);
        document.getElementById('avgProductivity').innerHTML = 
        "The average productivity is " + (avgProductivity/len).toFixed(2);
      }

      data.addRows(dataArray);

      var chart = new google.visualization.AreaChart(document.getElementById('chart'));

      chart.draw(data, options);
    }
  }
  ])

// function to parse the date
var todayDate = function(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  return yyyy+'-'+mm+'-'+dd;
}