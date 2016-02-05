/**
 * Created by sth on 2/5/16.
 */
'use strict';
angular.module('pnsPolymusicClientApp').directive('playBtn', function() {
  function playBtnController($scope, DurationService){

    $scope.playTracks = function(tracks) {
      if (!tracks) {
        tracks = $scope.currentSong.tracks;
      }
      if (!$scope.currentSong.timer) {
        $scope.currentSong.timer = DurationService.getNewDuration({totalTime:$scope.currentSong.duration});
      }
      angular.forEach(tracks, function(track, key) {
        track.play();
      });
      //$scope.playing = true;
      $scope.currentSong.playing = true;
    };

    $scope.stopTracks = function(tracks) {
      if (!tracks) {
        tracks = $scope.currentSong.tracks;
      }
      angular.forEach(tracks, function(track, key) {
        track.stop();
      });
      //$scope.playing = false;
      $scope.currentSong.playing = false;
    };

  }

  //return the template of player-slider
  return {
    restrict: 'EA',
    scope: {
      currentSong: '=song'
    },
    templateUrl: 'scripts/directives/playBtn/playBtn.html',
    controller: playBtnController
  };


});
