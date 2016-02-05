'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: songFactory
 * @description
 * # songFactory: save all song data
 * a song, il contains some track files of mp3
 * Controller of the pnsPolymusicClientApp
 */

angular.module('pnsPolymusicClientApp').factory('AudioSongFactory', function (DurationService) {

  var AudioSongFactory = {};

  function AudioSong(init) {

    this.ready = false;
    this.playing = false;
    this.readableDuration = '00:00';
    this.aCtx = init.ctx;
    this.tracks = [];
    this.useAudioTag = init.useAudioTag;
    this.loadCount = 0;
  }


  AudioSong.prototype.playTracks = function (tracks) {
    if (!tracks) {
      tracks = this.tracks;
    }
    if (!this.timer) {
      this.timer = DurationService.getNewDuration({totalTime:this.duration});
    }
    angular.forEach(tracks, function(track, key) {
      track.play();
    });
    this.playing = true;
  };


  AudioSong.prototype.stopTracks = function(tracks) {
    if (!tracks) {
      tracks = this.tracks;
    }
    angular.forEach(tracks, function(track, key) {
      track.stop();
    });
    this.playing = false;
  };


  AudioSong.prototype.clearAudios = function () {
    angular.forEach(this.tracks, function(track, key) {
      track.clear();
      track.stop();
    });
  };

  AudioSong.prototype.solo = function () {
    angular.forEach(this.tracks, function(track) {
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

  AudioSongFactory.getNewAudioSong = function (init) {
    return new AudioSong(init)
  };

  return AudioSongFactory;
});
