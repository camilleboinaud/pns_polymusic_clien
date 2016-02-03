/**
 * Created by sth on 2/2/16.
 */
'use strict';
angular.module('pnsPolymusicClientApp').directive('playerSlider', function() {
  function playerSliderController($scope, DurationService){

    $scope.percent = 0;
    $scope.currentTime = '00:00';

      /**
       * move slider
       * @param percent
       */
    $scope.playerSliderMove = function (percent){
      if(percent) {
        $scope.percent = percent;
      }
    };

    /**
     * When slider is pressed
     */
    $scope.playerSliderPressed = function () {
      if($scope.currentSong.timer) {
        $scope.currentSong.timer.stopTimer();
      }
    };

    /**
     * When slider is clicked
     */
    $scope.playerSliderClick = function () {
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

    /**
     * Init timer
     */
    $scope.currentSong.timer = DurationService.getNewDuration({
      totalTime:$scope.currentSong.duration,
      currentPercent: $scope.percent
    });

    /**
     * convert seconds to human readable duration
     * @param second
     * @returns {string}
     */
    var secondtoHHMMSS = function (second) {
      var hours   = Math.floor(second / 3600);
      var minutes = Math.floor((second - (hours * 3600)) / 60);
      var seconds = Math.floor(second - (hours * 3600) - (minutes * 60));

      if (hours   < 10) {hours   = '0'+hours;}
      if (minutes < 10) {minutes = '0'+minutes;}
      if (seconds < 10) {seconds = '0'+seconds;}
      if (hours == '00'){
        return minutes+':'+seconds;
      } else {
        return hours+':'+minutes+':'+seconds;
      }
    };

      /**
       * set up listeners
       */
    // isPlaying changed
    $scope.$watch('currentSong.playing', function (newValue, oldValue) {
      if($scope.currentSong.timer) {
        if (newValue) {
          $scope.currentSong.timer.startTimer($scope.playerSliderMove);
        } else {
          $scope.currentSong.timer.pauseTimer();
        }
      }
    });

    $scope.$watch('currentSong', function(currentSong, oldSong) {
      if(oldSong.timer) {
        oldSong.timer.stopTimer();
      }
      $scope.percent = 0;
      $scope.currentTime = '00:00';
    });

    $scope.$watch('percent', function(percent, oldPercent) {
      if(oldPercent && $scope.currentSong.duration) { // not first time
        $scope.currentTime = secondtoHHMMSS($scope.currentSong.duration * percent / 100);
      }
    });


  }


  //return the template of player-slider
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
