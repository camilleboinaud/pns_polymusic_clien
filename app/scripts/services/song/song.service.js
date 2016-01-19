/**
 * Created by sth on 1/19/16.
 */

'use strict';

angular.module('song').factory('SongService', ['TrackService', '$window', function (TrackService, $window) {
  var SongService = {},
    ngPlayingSong = 0,
    playingSongList = [];

  /**
   * This is constructor of PlayingMusic
   * @param audioContext
   * @param initValue
   * @constructor
   */
  function PlayingSong(audioContext, initValue){

    var trackIndex = 0,
      me = this;

    this.index = ngPlayingSong;
    ngPlayingSong++;

    me.audioContext = audioContext; // get audio context

    // start init tracks
    me.playingTrackList = [];
    if(initValue && initValue.tracks) {
      initValue.tracks.forEach(function(track){
        track.index = trackIndex;
        trackIndex++;
        var playingTrack = TrackService.newPlayingTrack(me.audioContext,track);
        me.playingTrackList.push(playingTrack);
      });
      this.ngTrack = initValue.tracks.length
    } else {
      this.ngTrack = 0;
    }

    this.name = (initValue && initValue.name) || 'unknown';
    this.cover = (initValue && initValue.cover) || 'default.jpg';
    this.url = (initValue && initValue.url) || '';
    this.time = (initValue && initValue.time) || {
        min:'00',
        sec:'00'
      };
    this.isPaused = true;
    this.isLoaded = false;
    this.isStarted = false;
    //this.audioBufferFromUrl = null;
    //this.audioBufferSourceNode = null;
    //this.trackVolumeNode = null;
    this.startTime = 0;
    this.lastTime = 0;
    this.pauseTime = 0;// pause duration
    this.offsetTime = 0;// play duration

    playingSongList.push(this);
  }

  SongService.newPlayingSong = function (audioContext, initValue) {
    return new PlayingSong(audioContext, initValue);
  };


  /**
   * Initialise the Audio Context
   * @returns the Audio Context
   */
  SongService.initAudioContext = function initAudioContext() {
    // There can be only one!
    var AudioContext = $window.AudioContext || $window.webkitAudioContext,
      ctx = new AudioContext();

    if(ctx === undefined) {
      throw new Error('AudioContext is not supported. :(');
    }
    return ctx;
  };


  //PlayingSong.prototype.loadSound= function loadSound(url, successCallback, errorCallback) {
  //  var me = this;
  //  me.playingTrackList.forEach(function (track) {
  //    track.loadSound(track.url)
  //  });
  //};

  PlayingSong.prototype.play = function (successCallback, errorCallback) {
    var me = this;
    me.playingTrackList.forEach(function (track) {
      track.play(function () {
        if (track.index === me.ngTrack) {
          if (successCallback) {
            successCallback();
          }
        }
      }, function () {
        if (track.index === me.ngTrack) {
          if (errorCallback) {
            errorCallback();
          }
        }
      });
    });
  };


  PlayingSong.prototype.pause = function (successCallback, errorCallback) {
    var me = this;
    me.playingTrackList.forEach(function (track) {
      track.pause(function () {
        if (track.index === me.ngTrack) {
          if (successCallback) {
            successCallback();
          }
        }
      }, function () {
        if (track.index === me.ngTrack) {
          if (errorCallback) {
            errorCallback();
          }
        }
      });
    });
  };

  PlayingSong.prototype.addTrack = function (newTrack, successCallback, errorCallback) {
    var me = this;
    newTrack.index = me.ngTrack;
    me.ngTrack++;
    var playingTrack = TrackService.newPlayingTrack(me.audioContext,newTrack);
    if (playingTrack){
      me.playingTrackList.push(playingTrack);
      if(successCallback){successCallback();}
    } else {
      if(errorCallback){errorCallback();}
    }
  };

  PlayingSong.prototype.removeTrack = function (index, successCallback, errorCallback) {
    var me = this;
    if(index >= me.playingTrackList.length || index < 0 ){
      if(errorCallback) {errorCallback();}
      return;
    }
    me.playingTrackList.splice(index,1);
    if(successCallback) {successCallback();}
  };





  SongService.getAllPlayingSong = function() {
    return playingSongList;
  };

  SongService.getPlayingSongAt = function(index) {
    if(index >= playingSongList.length ){
      return;
    }
    return playingSongList[index];
  };

  SongService.updatePlayingSongAt = function(index, newValue, callback) {
    if(index >= playingSongList.length ){
      return;
    }
    var song = playingSongList[index];
    if(newValue){
      if(newValue.name) {song.name = newValue.name;}
      if(newValue.cover) {song.cover = newValue.cover;}
      if(newValue.url) {song.url = newValue.url;}
      if(newValue.time) {song.time = newValue.time;}
      if(newValue.isPaused) {song.isPaused = newValue.isPaused;}
      if(newValue.isLoaded) {song.isLoaded = newValue.isLoaded;}
      if(newValue.isStarted) {song.isStarted = newValue.isStarted;}
      //if(newValue.audioBufferFromUrl) {song.audioBufferFromUrl = newValue.audioBufferFromUrl;}
      //if(newValue.audioBufferSourceNode) {song.audioBufferSourceNode = newValue.audioBufferSourceNode;}
      //if(newValue.trackVolumeNode) {song.trackVolumeNode = newValue.trackVolumeNode;}
      if(newValue.startTime) {song.startTime = newValue.startTime;}
      if(newValue.lastTime) {song.lastTime = newValue.lastTime;}
      if(newValue.pauseTime) {song.pauseTime = newValue.pauseTime;}
      if(newValue.offsetTime) {song.offsetTime = newValue.offsetTime;}
      if(newValue.audioContext) {song.audioContext = newValue.audioContext;}
      if(newValue.tracks) {
        // start init tracks
        song.playingTrackList = [];
        var trackIndex = 0;
        newValue.tracks.forEach(function(track){
            track.index = trackIndex;
            trackIndex++;
            var playingTrack = TrackService.newPlayingTrack(song.audioContext,track);
            song.playingTrackList.push(playingTrack);
          });
        this.ngTrack = newValue.tracks.length;
      }
    }

    playingSongList[index] = song;
    if(callback) {callback();}
  };

  return SongService;


}]);
