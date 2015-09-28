angular.module('myApp.controllers', [])

  .controller('AppCtrl', ['$scope', '$log', '$routeParams', 'storage', function($scope, $log, $routeParams, storage) {

    $scope.data = {
      faculties: [],
      departments: [],
      courses: [],
      groups: [],
      schedule: []
    }

    $scope.model = {
      faculty: null,
      department: null,
      course: null
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
    });

    $scope.loadGroupSchedule = function() {
      $log.log('run');
      storage.getGroupSchedule($scope.model.group).success(function(response){
        $scope.data.schedule = response;
      })
    }

  }])