'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:ManageSongCtrl
 * @description
 * # ManageSongCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp').controller('ManageSongCtrl', ['$scope', 'User','SongREST', function ($scope, User, SongREST) {

  //get all songs
  SongREST.getAllPubSongs(
    function (songs) {
      $scope.songs = songs;
    });


}]);
