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