/*
 * GrSU Web Schedule v1.0
 * https://github.com/sergeyloysha/grsu-web-schedule
 * Copyright (C) 2015 Sergey Loysha <sergeyloysha@gmail.com>
 * https://github.com/sergeyloysha/grsu-web-schedule/blob/master/LICENSE
 */

'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'AppCtrl',
      templateUrl: 'assets/views/schedule.html'
    })
    .when('/test', {
      controller: 'TestCtrl',
      templateUrl: 'assets/views/test.html'
    })
    .otherwise({
      redirectTo: '/schedule'
    })
}])

.constant('config', {
  apiUrl: 'http://api.grsu.by/1.x/app1'
})
angular.module('myApp.controllers', [])

  .controller('AppCtrl', ['$scope', '$log', '$routeParams', 'storage', function($scope, $log, $routeParams, storage) {

    var today = new Date();

    $scope.layout = localStorage.getItem('layout') || 'list';

    $scope.setLayout = function (layout) {
        $scope.layout = layout;
        localStorage.setItem('layout', layout);
    };

    $scope.isLayout = function (layout) {
        return $scope.layout == layout;
    };

    $scope.isToday = function(input) {
      var day = new Date(input);
      return day.toDateString() == today.toDateString();
    }

    $scope.data = {
      faculties: [],
      departments: [],
      courses: [],
      groups: [],
      schedule: []
    }

    $scope.model = {
      faculty: localStorage.getItem('facultyId') || null,
      department: localStorage.getItem('departmentId') || null,
      course: localStorage.getItem('courseId') || null,
      group: localStorage.getItem('groupId') || null
    }
    
    storage.getFaculties().success(function(response){
      $scope.data.faculties = response.items;
    })

    storage.getDepartments().success(function(response) {
      $scope.data.departments = response.items;
    })

    $scope.data.courses = storage.getCourses().items;

    $scope.$watchCollection('model', function(values, previous) {
      if(values.faculty && values.department && values.course) {
        $log.log(values.faculty + ' ' + values.department + ' ' + values.course + ' ' + values.group)
        storage.getGroups(values.faculty, values.department, values.course).success(function(response){
          $scope.data.groups = response.items;
        })
      }

      if(values.faculty && values.department && values.course && values.group) {
        if(values.group != null && values.group != 'null')
        $scope.loadGroupSchedule();
      }
    });

    $scope.loadGroupSchedule = function() {
      $log.log('run');
      storage.getGroupSchedule($scope.model.group).success(function(response){
        $scope.data.schedule = response;
      })
    }

    $scope.saveGroup = function() {
      localStorage.setItem('facultyId', $scope.model.faculty);
      localStorage.setItem('departmentId', $scope.model.department);
      localStorage.setItem('courseId', $scope.model.course);
      localStorage.setItem('groupId', $scope.model.group);
    }

  }])

  .controller('TestCtrl', ['$scope', '$log', 'storage', function($scope, $log, storage) {
    $scope.text = 'Тест'
  }]);
angular.module('myApp.directives', []);
angular.module('myApp.services', [])

  .factory('storage', ['$http', 'config', function($http, config){
    return {
      getFaculties: function() {
        return $http.get(config.apiUrl + '/getFaculties');
      },

      getDepartments: function() {
        return $http.get(config.apiUrl + '/getDepartments');
      },

      getCourses: function() {
        return {"items": [
          {"id": 1, "title": "1"},
          {"id": 2, "title": "2"},
          {"id": 3, "title": "3"},
          {"id": 4, "title": "4"},
          {"id": 5, "title": "5"},
          {"id": 6, "title": "6"}
        ]}
      },

      getGroups: function(faculty, department, course) {
        return $http.get(config.apiUrl + '/getGroups?facultyId='+ faculty +'&departmentId='+ department +'&course='+ course);
      },

      getDates: function() {

      },

      getGroupSchedule: function(group) {
        return $http.get(config.apiUrl + '/getGroupSchedule?groupId=' + group + '&dateStart=05.10.2015&dateEnd=11.10.2015');
      }
    }
  }])
angular.module('myApp.filters', [])

  .filter('dayFilter', ['$filter', function($filter){
    return function(input, uppercase) {
      input = input || '';

      var day = new Date(input).getDay();

      var days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
      ];

      return days[day];
    }
  }])

  .filter('dateFilter', ['$filter', function($filter){
    return function(input, uppercase) {
      input = input || '';

      input = new Date(input);

      var date = input.getDate();
      var month = input.getMonth();
      var year = input.getFullYear();

      var months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря'
      ];

      return date + ' ' + months[month] + ' ' + year;
    }
  }])