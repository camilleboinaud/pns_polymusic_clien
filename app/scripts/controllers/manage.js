'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:ManageSongCtrl
 * @description
 * # ManageSongCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp').controller('ManageSongCtrl', ['$scope', 'User','SongREST','$timeout', function ($scope, User, SongREST, $timeout) {

  $scope.delete_info = false;

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
  $scope.update_song = function (songID, isPublic) {
    var params = {
      userId: User.getCurrentUser().id,
      songId: songID,
      isPub: isPublic
    };
    SongREST.updateSongById(params, function (message) {
      console.info(message);
      if(message.message == "song update success"){

      }
    })
  };

  $scope.delete = function (songID) {
    var params = {
      userId: User.getCurrentUser().id,
      songId: songID
    };
    console.info(params);
    SongREST.deleteSongById(params, function (response) {
      //show delete success, and close after 2 secounds
      $scope.delete_info = true;
      $timeout(function() {
        $scope.delete_info = false;
      }, 2000);

      //update the songs list
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
    })
  }

}]);
