'use strict';

angular.module('pnsPolymusicClientApp').controller('NavController', ['$scope', 'User', function ($scope, User) {

  $scope.isLoggedIn = function(){
    return User.isLoggedIn();
  };

  $scope.logout = function(){
    User.logout(function(msg){
      console.log(msg)
      window.location.href = '/#/';
    });
  };

}]);

