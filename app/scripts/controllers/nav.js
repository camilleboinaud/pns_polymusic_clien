'use strict';

angular.module('pnsPolymusicClientApp').controller('NavController', ['$scope', 'User', function ($scope, User) {



  $scope.isLoggedIn = function(){
    return User.isLoggedIn();
  };

  $scope.$watch('isLoggedIn', function (newValue) {
    if(newValue) {
      $scope.user = User.getCurrentUser();
    }
  });

  $scope.logout = function(){
    User.logout(function(msg){
      console.log(msg);
      window.location.href = '/#/';
    });
  };
}]);

