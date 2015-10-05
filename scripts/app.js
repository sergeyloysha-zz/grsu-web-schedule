/*
 * GrSU Web Schedule v1.0
 * https://github.com/sergeyloysha/grsu-web-schedule
 * Copyright (C) 2015 Sergey Loysha <sergeyloysha@gmail.com>
 * https://github.com/sergeyloysha/grsu-web-schedule/blob/master/LICENSE
 */

'use strict';

angular.module('myApp', [
  'angular-loading-bar',
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
])

.config(['$routeProvider', 'cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider) {
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

    $scope.isToday = function(input) {
      var day = new Date(input);
      return day.toDateString() == today.toDateString();
    }

    $scope.data = {
      faculties: [],
      departments: [],
      courses: [],
      groups: [],
      schedule: [],
      dates: [],
      layouts: []
    }

    $scope.model = {
      faculty: localStorage.getItem('facultyId') || null,
      department: localStorage.getItem('departmentId') || null,
      course: localStorage.getItem('courseId') || null,
      group: localStorage.getItem('groupId') || null,
      date: localStorage.getItem('dateId') || 1,
      layout: localStorage.getItem('layoutId') || 'list'
    }
    
    storage.getFaculties().success(function(response){
      $scope.data.faculties = response.items;
    })

    storage.getDepartments().success(function(response) {
      $scope.data.departments = response.items;
    })

    $scope.data.courses = storage.getCourses().items;

    $scope.data.dates = storage.getDates().items;

    $scope.data.layouts = storage.getLayouts().items;

    $scope.$watchCollection('model', function(values, previous) {
      if(values.faculty && values.department && values.course) {
        storage.getGroups(values.faculty, values.department, values.course).success(function(response){
          $scope.data.groups = response.items;
        })
      }
    });

    $scope.$watch('model.group', function(newValue, oldValue) {
      if(newValue == null) {
        $scope.data.schedule = [];
      } else {
        $scope.loadGroupSchedule();
      }
    });

    $scope.$watch('model.date', function(newValue, oldValue) {
      localStorage.setItem('dateId', newValue);
    });

    $scope.$watch('model.layout', function(newValue, oldValue) {
      localStorage.setItem('layoutId', newValue);
    });

    $scope.loadGroupSchedule = function() {
      if($scope.model.group != null) {
        storage.getGroupSchedule($scope.model.group, $scope.setScheduleDates()).success(function(response){
          $scope.data.schedule = response;
        })
      }
    }

    $scope.saveGroup = function() {
      localStorage.setItem('facultyId', $scope.model.faculty);
      localStorage.setItem('departmentId', $scope.model.department);
      localStorage.setItem('courseId', $scope.model.course);
      localStorage.setItem('groupId', $scope.model.group);
    }

    $scope.deleteGroup = function() {
      localStorage.removeItem('facultyId');
      localStorage.removeItem('departmentId');
      localStorage.removeItem('courseId');
      localStorage.removeItem('groupId');
    }

    $scope.getGroupName = function() {
      for(var i in $scope.data.groups) {
        if($scope.data.groups[i].id == $scope.model.group) {
          return $scope.data.groups[i].title;
        }
      }
    }

    $scope.isGroup = function() {
      if($scope.model.group != null) {
        return $scope.model.group == localStorage.getItem('groupId');
      }
    }

    $scope.setScheduleDates = function() {
      if($scope.model.date == 1) {
        return {'dateStart': moment().startOf('week').format('DD.MM.YYYY'), 'dateEnd': moment().endOf('week').format('DD.MM.YYYY')}
      } else if ($scope.model.date == 2) {
        return {'dateStart': moment().format('DD.MM.YYYY'), 'dateEnd': moment().format('DD.MM.YYYY')}
      }
    }

  }])

  .controller('TestCtrl', ['$scope', '$log', 'storage', function($scope, $log, storage) {
    $scope.text = 'Тест'
  }]);
angular.module('myApp.directives', []);
angular.module('myApp.services', [])

  .factory('storage', ['$http', 'config', function($http, config){

    var today = new Date();

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
        return {"items": [
          {"id": 1, "title": "На неделю"},
          {"id": 2, "title": "Сегодня"}
        ]}
      },

      getLayouts: function() {
        return {"items": [
          {"id": "list", "icon": "menu-hamburger"},
          {"id": "grid", "icon": "th"}
        ]}
      },

      getGroupSchedule: function(group, dates) {
        console.log(dates);
        return $http.get(config.apiUrl + '/getGroupSchedule?groupId=' + group + '&dateStart=' + dates.dateStart + '&dateEnd=' + dates.dateEnd);
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