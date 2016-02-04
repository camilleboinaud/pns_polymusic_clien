'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:AuthentificationCtrl
 * @description
 * # AuthentificationCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp').controller('AuthentificationCtrl', ['$scope', 'User', function ($scope, User) {

  $scope.info = null;

  $scope.register = function(user){
    if(user && user.username && user.email && user.password) {

      if (user.password[0] === user.password[1]) {
        user.password = user.password[0];
        User.register(user,
          function (msg) {
            if(msg.success === false){
              $scope.info = msg.message;
            } else {
              window.location.href = '/';
            }
          }, function (msg) {
            $scope.info = 'Error: ' + msg;
          }
        );

      } else {
        $scope.info = "Oops.. passwords do not match";
      }

    } else {
      $scope.info = "Oops.. all fields needs to be filled";
    }

  };

  $scope.login = function(user){
    if(user !== null && user.email !== null && user.password !== null){
      User.login(user,
        function(msg) {
          console.info(msg);
          if(msg.success === false){
            $scope.info = msg.message;
          } else {
            window.location.href = '/';
          }
        }, function (msg) {
          $scope.info = 'Error: ' + msg;
        }
      );
    } else {
      $scope.info = "Oops.. all fields needs to be filled";
    }

  };

}]);
