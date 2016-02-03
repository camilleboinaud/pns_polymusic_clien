'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('MainCtrl', ['$scope', 'songFactory','SongREST', '$document', 'DurationService', function ($scope, songFactory, SongREST, $document, DurationService) {

    //here's no way to detect whether a browser can play multiple audio elements at once.
    var isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    var thisLoadCount = 0;

    $scope.currentSong = {
      ready: false,
      playing: false
    };

    //$scope.ready = false;
    //$scope.playing = false;
    $scope.trackWidth = 0;
    $scope.aCtx = null;
    $scope.master = {};
    $scope.useAudioTag = true;
    $scope.masterGain = 100;

    (function init() {
      if (!window.AudioContext) {
        // bag it and go home
        $scope.error = true;
        return;
      }

      setTrackWidth();
      initAudio();
      songFactory.getAllPubSongs(function (songs) {
        $scope.songs = songs;
      });

    })();


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

    $scope.$watch('currentSong', function(currentSong, oldSong) {
      if ($scope.currentSong.playing) {
        $scope.stopTracks(oldSong.tracks);
      }
      if (oldSong) {
        clearAudios(oldSong.tracks);
        //$scope.ready = false;
        $scope.currentSong.ready = false;
        thisLoadCount = 0;
      }
    });

    $scope.$watch('masterGain', function(value) {
      value = value / 100;
      $scope.master.gainNode.gain.value = value;
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
      });
    }

    function initAudio() {
      $scope.aCtx = new window.AudioContext();
      $scope.aCtx.createGain = $scope.aCtx.createGain || $scope.aCtx.createGainNode;
      $scope.master.gainNode = $scope.aCtx.createGain();
      $scope.master.gainNode.connect($scope.aCtx.destination);

      if (!$scope.aCtx.createMediaElementSource || isiOS) {
        $scope.useAudioTag = false;
      }
    }

    function setTrackWidth() {
      $scope.trackWidth = 370;
    }

    /**
     * Get song list by search_text
     * @param isASong boolean
     */
    $scope.search = function (isASong) {
      var params = {
        search_text: $scope.search_song,
        isSong: isASong
      };
      SongREST.searchSong(params, function (data) {
        $scope.songs = data;
      });
    };


    $scope.solo = function() {
      var tracks = $scope.currentSong.tracks;
      angular.forEach(tracks, function(track) {
        if(track.getTrackIsSolo() === false) {
          console.log(track.getTrackIsSolo());
        }
      });
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
  }]);
