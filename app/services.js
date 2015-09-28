angular.module('myApp.services', [])

  .factory('storage', ['$http', function($http){
    return {
      getFaculties: function() {
        return $http.get('http://api.grsu.by/1.x/app1/getFaculties');
      },

      getDepartments: function() {
        return $http.get('http://api.grsu.by/1.x/app1/getDepartments');
      },

      getCourses: function() {
        return {"items": [
          {"id": 1, "title": "1"},
          {"id": 2, "title": "2"},
          {"id": 3, "title": "3"},
          {"id": 4, "title": "4"},
          {"id": 5, "title": "5"},
          {"id": 6, "title": "6 курс"}
        ]}
      },

      getGroups: function(faculty, department, course) {
        return $http.get('http://api.grsu.by/1.x/app1/getGroups?facultyId='+ faculty +'&departmentId='+ department +'&course='+ course);
      },

      getDates: function() {

      },

      getGroupSchedule: function(group) {
        return $http.get('http://api.grsu.by/1.x/app1/getGroupSchedule?groupId=' + group + '&dateStart=21.09.2015&dateEnd=27.09.2015');
      }
    }
  }])