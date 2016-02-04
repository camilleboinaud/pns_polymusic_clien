'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:ManageSongCtrl
 * @description
 * # ManageSongCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp').controller('ManageSongCtrl', ['$scope', 'User','SongREST', function ($scope, User, SongREST) {

  //get all songs of user
  var params = {
    userId: User.getCurrentUser().id
  };
 SongREST.getSongsByUser(
   params,
   function (songs) {
     $scope.my_songs  = songs;
     console.info(songs);
   }
  );

  //change the visibility of song
  $scope.change_visibility = function () {

  }

}]);
