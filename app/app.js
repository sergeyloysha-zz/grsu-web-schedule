/**
сука
 * @ngdoc overview
 * @name stack-angularjs
 * @requires ui.router, ngSanitize, ngCookies
 * @description Location-based social influence platform
 */
var app = angular.module('stack-angularjs', ['ui.router', 'ngSanitize', 'ngCookies']);

var baseURL = 'http://dev.devion.io'; // Development
var baseURL = 'http://production.devion.io'; // Production

// Routes
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          "main": {
            controller: 'LoginController',
            templateUrl: 'assets/views/login.html'
          }
        },
        authenticate: false
      })
      .state('home', {
        url: '/',
        views: {
          "main": {
            controller: 'HomeController',
            templateUrl: 'assets/views/home.html'
          }
        },
        authenticate: false
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          "main": {
            controller: 'DashboardController',
            templateUrl: 'assets/views/dashboard.html'
          }
        },
        authenticate: true
      });

    $urlRouterProvider.otherwise('/');
  }
]);

// User Access and Authentication control
app.run(['$rootScope', '$state', 'UserService', function($rootScope, $state, UserService) {

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.currentState = toState.name;
    /**
     * if the state does not requires authentication and the
     * user is logged in, redirect to the dashboard page.
     */
    if (!toState.authenticate && UserService.isLoggedIn()) {
      $state.transitionTo('dashboard');
      event.preventDefault();
    }

    /**
     * if the state requires authentication and the
     * user is not logged in, redirect to the login page.
     */
    if (toState.authenticate && !UserService.isLoggedIn()) {
      $state.transitionTo('login');
      event.preventDefault();
    }

  });
}]);
