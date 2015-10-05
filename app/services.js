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