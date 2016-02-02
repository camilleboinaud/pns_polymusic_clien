'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:AuthentificationCtrl
 * @description
 * # AuthentificationCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp').controller('AuthentificationCtrl', ['$scope', 'User', function ($scope, User) {

    $scope.register = function(user){
        if(user !== null && user.username !== null && user.email !== null && user.password !== null) {

          if (user.password[0] === user.password[1]) {
            user.password = user.password[0];
            User.register(user,
              function (msg) {
                window.location.href = '/#/';
                console.info('Success: ', msg);
              }, function (msg) {
                console.info('Error: ' + msg);
              }
            );

          } else {
            console.info("Oops.. passwords do not match")
          }

        } else {
          console.log("Oops.. all fields needs to be filled")
        }

    };

    $scope.login = function(user){

      if(user !== null && user.email !== null && user.password !== null){
        User.login(user, function(msg) {
            window.location.href = '/#/'
          }, function (msg) {
            console.error('Error: ' + msg);
          }
        );
      } else {
        console.log("Oops.. all fields needs to be filled");
      }

    };

}]);
