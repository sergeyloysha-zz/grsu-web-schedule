/**
 * @ngdoc service
 * @name UserService
 * @requires $rootScope, $http, $q, $cookieStore
 * @description 
 * 
 * This service is used to connect with the user endpoints.
 * 
 */

app.factory('UserService', function($rootScope, $http, $q, $cookieStore) {
  $rootScope.currentUser = $cookieStore.get('user') || null;

  return {
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout
  };

  /**
   * Verifies if the user is logged in.
   * @return {Boolean} True when there is an user in the system.
   */
  function isLoggedIn() {
    var user = $rootScope.currentUser;
    return !!user;
  };

  /**
   * Login an user into the app
   * @param  {Object}  params Login params.
   * @return {Promise}        Promise of the request made.
   */
  function login(params) {
    var deferred = $q.defer();

    $http({
      method: 'POST',
      url: baseURL + 'login',
      data: params
    }).success(function(resp) {
      $rootScope.currentUser = resp.user;
      $cookieStore.put('user', resp.user);
      deferred.resolve(resp);
    }).error(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
   * Clears the currentUser data.
   */
  function logout() {
    $rootScope.currentUser = null;
    $cookieStore.put('user', null);
  };

});
