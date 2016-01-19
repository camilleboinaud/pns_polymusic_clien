'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('MainCtrl', ['$scope', 'SongService', 'REST', function ($scope, SongService, REST) {
    REST.getAllPubSongs(function(data){
      $scope.playlist = data;
      $scope.playlist.forEach(function (song) {
        song.isPlaying = false;
        song.url = REST.getSongUrlById(song._id);
      });
    });

    $scope.lastIndex = 0;
    $scope.playMusic = function playMusic(index,barIndex){
      console.log('click index = '+index+' barIndex = '+ barIndex);
      if(!$scope.playlist[index].isPlaying) {
        SongService.updateSongAtPlayer(barIndex, $scope.playlist[index], function () {
          console.log($scope.playlist[$scope.lastIndex]);
          $scope.playlist[$scope.lastIndex].isPlaying = false;
          $scope.playlist[index].isPlaying = true;
          $scope.lastIndex = index;
          //Music.getPlayingMusicAt(0).load();
        });
        console.log('Music playing = '+SongService.getSongAtPlayer(0).name);
      }
    };


  }]);
