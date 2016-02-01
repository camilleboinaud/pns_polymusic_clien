'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('MainCtrl', ['$scope', 'songFactory','SongREST', function ($scope, songFactory, SongREST ) {

    //here's no way to detect whether a browser can play multiple audio elements at once.
    var isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    var thisLoadCount = 0;

    $scope.currentSong;

    $scope.ready = false;
    $scope.playing = false;
    $scope.trackWidth;
    $scope.aCtx;
    $scope.master = {};
    $scope.useAudioTag = true;

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
      angular.forEach(tracks, function(track, key) {
        track.play();
      });
      $scope.playing = true;
    };

    $scope.stopTracks = function(tracks) {
      if (!tracks) {
        tracks = $scope.currentSong.tracks;
      }
      angular.forEach(tracks, function(track, key) {
        track.stop();
      });
      $scope.playing = false;
    };

    $scope.$watch('currentSong', function(currentSong, oldSong) {
      if ($scope.playing) {
        $scope.stopTracks(oldSong.tracks);
      }
      if (oldSong) {
        clearAudios(oldSong.tracks);
        $scope.ready = false;
        thisLoadCount = 0;
      }
    });


    $scope.trackLoad = function(key, track) {
      if (++thisLoadCount >= $scope.currentSong.tracks.length) {
        $scope.ready = true;
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
      $scope.trackWidth = 400;
    }

    /**
     * Get song list by search_text
     * @param isSong boolean
     */
    $scope.search = function (isASong) {
      var params = {
        search_text: $scope.search_song,
        isSong: isASong
      };
      SongREST.searchSong(params, function (data) {
        $scope.songs = data;
      });
    }

  }]);
