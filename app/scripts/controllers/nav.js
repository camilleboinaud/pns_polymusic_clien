'use strict';

angular.module('pnsPolymusicClientApp').controller('NavController', ['$scope', 'User', function ($scope, User) {

  $scope.isLoggedIn = User.isLoggedIn();
  $scope.logout = User.logout(function(msg){
    console.log(msg)
  	window.location.href = '/#/';
  });

}]);

