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