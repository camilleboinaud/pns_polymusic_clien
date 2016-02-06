'use strict';
angular.module('pnsPolymusicClientApp').directive('trackContainer', function() {

  function trackContrainerController ($scope, AudioContextService){

    $scope.aCtx = $scope.$parent.aCtx;
    $scope.useAudioTag = false;
    var thisLoadCount = 0;

    $scope.$watch('currentSong', function(currentSong, oldSong) {
      if (oldSong) {
        if (oldSong.playing) {
          clearAudios(oldSong.tracks);
        }
        oldSong.ready = false;
        oldSong.playing = false;
        thisLoadCount = 0;
      }
    });

    $scope.trackLoad = function(key, track) {
      // get longest duration
      if(!$scope.currentSong.duration || $scope.currentSong.duration < track.getDuration()){
        $scope.currentSong.duration = track.getDuration();
      }
      if (++thisLoadCount >= $scope.currentSong.tracks.length) {
        $scope.currentSong.readableDuration = secondtoHHMMSS($scope.currentSong.duration);
        $scope.currentSong.ready = true;
        $scope.$$phase || $scope.$apply();
        tick();
      }
    };

    function tick() {
      angular.forEach($scope.currentSong.tracks, function(track, key) {
        if (track.draw) {
          track.draw();
        }
      });
      window.requestAnimationFrame(tick);
    }


    function clearAudios(tracks) {
      angular.forEach(tracks, function(track, key) {
        track.clear();
        track.stop();
      });
    }

    $scope.solo = function() {
      var tracks = $scope.currentSong.tracks;
      var trackIsSolo = false;
      angular.forEach(tracks, function(track) {
        if(track.getTrackIsSolo() === true) {
          trackIsSolo = true;
        }
      });
      if(trackIsSolo == true) {
        angular.forEach(tracks, function(track) {
          if(track.getTrackIsSolo() === false) {
            track.setSoloOn();
          } else {
            track.setSoloOff();
          }
        });
      } else {
        angular.forEach(tracks, function(track) {
          track.setSoloOff();
        });
      }
    };

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

  }


  //return the template of player-slider
  return {
    restrict: 'EA',
    scope: {
      currentSong: '=song',
      master:'='
    },
    templateUrl: 'scripts/directives/track/trackContainer.html',
    controller: trackContrainerController
  };

});
