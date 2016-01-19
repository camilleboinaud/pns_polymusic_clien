/**
 * Created by sth on 1/19/16.
 */
'use strict';
angular.module('song').factory('SongModel',['TrackModel',function(TrackModel){


  function resetByNewValue(me,newValue) {
    // default value
    me.name = 'unknown';
    me.url = '';
    me.time = {min:'00', sec:'00'};
    me.cover = 'default.jpg';
    // change by initValue
    if (newValue){
      if (newValue.name) {me.name = newValue.name;}
      if (newValue.url) {me.url = newValue.url;}
      if (newValue.time) {me.time = newValue.time;}
      if (newValue.cover) {me.time = newValue.cover;}
    }

    me.isPaused = true;
    me.isLoaded = false;
    me.isStarted = false;
    me.startTime = 0;
    me.lastTime = 0;
    me.pauseTime = 0;// pause duration
    me.offsetTime = 0;// play duration

    me.songVolumeNode = null;

    // start init tracks
    me.trackList = [];
    if(newValue && newValue.tracks) {initTracks(me, newValue.tracks);}
  }


  /**
   * This is constructor of SongModel
   * @param audioContext
   * @param initValue
   * @constructor
   */
  var SongModel = function (audioContext, initValue){

    var me = this;
    me.audioContext = audioContext; // get audio context
    resetByNewValue(me,initValue);

  };

  SongModel.prototype.resetByNewValue = resetByNewValue;
  /**
   * Play
   * @param callback
   */
  SongModel.prototype.play = function (callback) {
    var me = this,
      // function for playing one track
      playOneTrack = function (track) {
        track.play(function(){
          // check if it is last one
          if (track.index === me.ngTrack-1) {
            me.isStarted = true;
            me.isPaused = false;
            if (callback) {callback();}
          }
        });
      },
      // function for playing all tracks
      playAllTrack = function () {
        // play all track
        me.trackList.forEach(function(track){
          playOneTrack(track);
        });
      };

    if (!me.isLoaded){
      me.trackList.forEach(function (track) {
        // preload for each track
        track.loadSound(track.url, function () {
          // check if it is last one
          if (track.index === me.ngTrack-1) {
            me.isLoaded = true;
            // all track loaded than play
            playAllTrack();
          }
        });
      });
    } else {
      playAllTrack();
    }
  };


  /**
   * pause
   * @param callback
   */
  SongModel.prototype.pause = function (callback) {
    var me = this;
    me.trackList.forEach(function (track) {
      track.pause(function(){
        // check if it is last one
        if (track.index === me.ngTrack-1) {
          me.isPaused = true;
          if (callback) {callback();}
        }
      });

    });
  };

  /**
   * add new track
   * @param newTrack: require "name","url","time"
   * @param successCallback
   * @param errorCallback
   */
  SongModel.prototype.addTrack = function (newTrack, successCallback, errorCallback) {
    var me = this;
    newTrack.index = me.ngTrack;
    me.ngTrack++;
    var trackModel = new TrackModel(me.audioContext,newTrack);
    if (trackModel){
      me.trackList.push(trackModel);
      if(successCallback){successCallback();}
    } else {
      // something goes wrong when creating new track model
      if(errorCallback){errorCallback();}
    }
  };

  /**
   * remove a track by index
   * @param index
   * @param successCallback
   * @param errorCallback
     */
  SongModel.prototype.removeTrackByIndex = function (index, successCallback, errorCallback) {
    var me = this;
    if(index >= me.trackList.length || index < 0 ){
      if(errorCallback) {errorCallback();}
      return;
    }
    me.trackList.splice(index,1);
    if(successCallback) {successCallback();}
  };

  /**
   * init tracks in SongModel by json: this is a private function
   * @param me
   * @param tracks
   */
  function initTracks(me, tracks){
    var trackIndex = 0;
    if(tracks) {
      tracks.forEach(function(track){
        track.index = trackIndex;
        trackIndex++;
        var trackModel = new TrackModel(me.audioContext,track);
        // save into list
        me.trackList.push(trackModel);
      });
      me.ngTrack = tracks.length;
    } else {
      me.ngTrack = 0;
    }
  }

  return SongModel;

}]);
