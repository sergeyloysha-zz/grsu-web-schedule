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
        storage.getGroups(values.faculty, values.department, values.course).success(function(response){
          $scope.data.groups = response.items;
        })
      }

      if(values.faculty && values.department && values.course && values.group) {
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