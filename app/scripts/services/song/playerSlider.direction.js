/**
 * Created by sth on 2/2/16.
 */
'use strict';
angular.module('pnsPolymusicClientApp').directive('playerSlider', function() {
  function playerSliderController($scope, DurationService){

    $scope.percent = 0;
    $scope.playerSliderMove = function (percent){
      if(percent) {
        $scope.percent = percent;
      }
    };

    $scope.playerSliderPressed = function () {
      console.log('pressed');
      if($scope.currentSong.timer) {
        $scope.currentSong.timer.stopTimer();
      }
    };

    $scope.playerSliderClick = function () {
      console.log($scope.percent);
      $scope.percent = parseFloat($scope.percent);

      $scope.currentSong.timer = DurationService.getNewDuration({
        totalTime:$scope.currentSong.duration,
        currentPercent: $scope.percent
      });

      if($scope.currentSong.tracks){
        $scope.currentSong.tracks.forEach(function (track) {
          if($scope.currentSong.playing) {track.stop();}
          track.setPauseTime($scope.currentSong.duration * $scope.percent / 100);
          if($scope.currentSong.playing) {track.play();}
        });
      }
      if($scope.currentSong.playing) {$scope.currentSong.timer.startTimer($scope.playerSliderMove);}
    };

    // init timer
    $scope.currentSong.timer = DurationService.getNewDuration({
      totalTime:$scope.currentSong.duration,
      currentPercent: $scope.percent
    });

    // isPlaying changed
    $scope.$watch('currentSong.playing', function (newValue, oldValue) {
      if($scope.currentSong.timer) {
        if (newValue) {
          console.log('start');
          $scope.currentSong.timer.startTimer($scope.playerSliderMove);
        } else {
          console.log('pause');
          $scope.currentSong.timer.pauseTimer();
        }
      }
      console.log('isPlaying = ' + newValue);
    });

    $scope.$watch('currentSong', function(currentSong, oldSong) {
      console.info(currentSong);
      if(oldSong.timer) {
        oldSong.timer.stopTimer();
      }
      $scope.percent = 0;
    });


  }


  //return the template of track
  return {
    restrict: 'EA',
    scope: {
      currentSong: '=song',
      id:'@playerSliderId'
    },
    templateUrl: 'scripts/services/song/playerSlider.html',
    controller: playerSliderController
  };


});
