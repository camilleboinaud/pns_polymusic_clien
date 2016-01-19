/**
 * Created by sth on 1/5/16.
 */
'use strict';

// For controlling playing music between PlayerCtr and PlaylistCtr
angular.module('song').factory('TrackService', ['$window',
    function ($window) {

        var Track = {},
          nbTrack = 0;
          //playingTrackList = [];

        /**
         * This is constructor of PlayingTrack
         * @param audioContext
         * @param initValue
         * @constructor
         */
        function PlayingTrack(audioContext, initValue){
          this.index = nbTrack;
          nbTrack++;
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
          this.audioBufferFromUrl = null;
          this.audioBufferSourceNode = null;
          this.trackVolumeNode = null;
          this.startTime = 0;
          this.lastTime = 0;
          this.pauseTime = 0;// pause duration
          this.offsetTime = 0;// play duration
          this.audioContext = audioContext; // get audio context

          //playingTrackList.push(this);
        }

        /**
         * Create a new PlayingTrack
         * @param audioContext
         * @param initValue
         * @returns {PlayingTrack}
         */
        Track.newPlayingTrack = function(audioContext, initValue){
            return new PlayingTrack(audioContext, initValue);
        };


        /**
         * Initialise the Audio Context
         * @returns the Audio Context
         */
        Track.initAudioContext = function initAudioContext() {
            // There can be only one!
            var AudioContext = $window.AudioContext || $window.webkitAudioContext,
                ctx = new AudioContext();

            if(ctx === undefined) {
                throw new Error('AudioContext is not supported. :(');
            }
            return ctx;
        };
      //
      //Track.getNbPlayingTrack = function getNbPlayingTrack() {
      //  return playingTrackList;
      //};



        /**
         * This function is defined as a prototype of PlayingTrack: Load sound from url
         * @param url
         * @param successCallback
         * @param errorCallback
         */
        PlayingTrack.prototype.loadSound = function loadSound(url, successCallback, errorCallback) {
            var request = new XMLHttpRequest(),
                me = this;
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                me.audioContext.decodeAudioData(
                    request.response,
                    function(audioBuffer) {
                      if (!audioBuffer) {
                        console.error('error decoding file data: ');
                        return;
                      }
                      console.log('Load music success');
                      // save the audioBuffer into PlayingTrack which we will use for resuming
                      me.audioBufferFromUrl = audioBuffer;
                      me.isLoaded = true;
                      if(successCallback) {successCallback();}
                    },
                    function(error) {
                        console.error('decodeAudioData error', error);
                    }
                );
            };
            //request.onprogress = function(e) {
            //    //console.log("loaded : " + e.loaded + " total : " + e.total);
            //};
            request.onerror = errorCallback;
            request.send();
        };

        /**
         * This function is defined as a prototype of PlayingTrack: play music
         * @param successCallback: success callback
         * @param errorCallback: error callback
         */
        PlayingTrack.prototype.play = function play(successCallback, errorCallback) {
            console.log('play music');
            var me = this,
                playSoundSuccess = function(trackVolumeNode,audioBufferSourceNode){
                    // mark start
                    if(!me.isStarted){
                        me.startTime = me.audioContext.currentTime;
                        me.lastTime = me.startTime;
                        me.isStarted = true;
                    }
                    me.isPaused = false;
                    me.audioBufferSourceNode = audioBufferSourceNode;
                    me.trackVolumeNode = trackVolumeNode;
                  if(successCallback) {successCallback();}
                };

            if(!me.isLoaded){
                // if it is not loaded, then start loading sound
                me.loadSound(me.url,function(){
                    playSoundFromAudioBuffer(me.audioContext,me.audioBufferFromUrl,me.offsetTime,playSoundSuccess);
                }, function(error){
                    // loadSound error callback function
                    console.log(error);
                    if(errorCallback) {errorCallback(error);}
                });
            } else {
                // It plays after pause
                if(me.audioBufferFromUrl === null){
                    var error = 'Something wrong when we loaded the sound';
                    console.log(error);
                    if(errorCallback) {errorCallback(error);}
                } else {
                    // calculate the pause duration
                    me.pauseTime = me.audioContext.currentTime - me.lastTime;
                    //playAfterPause(me.audioBufferSourceNode,me.offsetTime);
                    playSoundFromAudioBuffer(me.audioContext,me.audioBufferFromUrl,me.offsetTime,playSoundSuccess);
                }
            }
        };


        /**
         * pause music
         * @param successCallback: success callback
         * @param errorCallback: error callback
         */
        PlayingTrack.prototype.pause = function pause(successCallback,errorCallback){
            console.log('pause music');
            var me = this;
            if(me.audioBufferSourceNode !== null){
                me.audioBufferSourceNode.stop(0);
                me.isPaused = true;
                // reset audioBufferSourceNode. Because audioBufferSourceNode.start() can only use once
                // we need recreate it from audioBuffer for the next time
                me.audioBufferSourceNode = null;
                me.lastTime = me.audioContext.currentTime;
                me.offsetTime = me.lastTime - me.startTime - me.pauseTime;
                if(successCallback) {successCallback();}
            } else {
                console.log('Something wrong when we loaded the sound');
                if(errorCallback) {errorCallback();}
            }
        };


        /**
         * Play sound from audioBuffer
         * @param audioContext
         * @param audioBuffer
         * @param offsetTime
         * @param callback
         */
        function playSoundFromAudioBuffer(audioContext,audioBuffer,offsetTime,callback) {
            var audioBufferSourceNode,
                trackVolumeNode,
            // Create a single gain node for master volume
                masterVolumeNode =  audioContext.createGain();

            // loadSound success callback function
            audioBufferSourceNode = audioContext.createBufferSource();
            audioBufferSourceNode.buffer = audioBuffer;
            // Connect the sound sample to its volume node
            trackVolumeNode = audioContext.createGain();
            audioBufferSourceNode.connect(trackVolumeNode);

            // Connects track volume node a single master volume node
            trackVolumeNode.connect(masterVolumeNode);
            masterVolumeNode.connect(audioContext.destination);
            // playing sound (when, offset, duration)
            // start playing
            audioBufferSourceNode.start(0, offsetTime);

            if (callback) {callback(trackVolumeNode,audioBufferSourceNode);}
        }



        //function playAfterPause(audioBufferSourceNode,offsetTime,callback) {
        //    audioBufferSourceNode.start(0, offsetTime);
        //    //if (callback) callback(trackVolumeNode,audioBufferSourceNode);
        //}



      //Track.getAllPlayingTrack = function() {
      //  return playingTrackList;
      //};

      //Track.getPlayingTrackAt = function(index) {
      //  if(index >= playingTrackList.length ){
      //    return;
      //  }
      //  return playingTrackList[index];
      //};

      //Track.updatePlayingTrackAt = function(index, newValue, callback) {
      //  if(index >= playingTrackList.length ){
      //    return;
      //  }
      //  var track = playingTrackList[index];
      //  if(newValue){
      //    if(newValue.name) {track.name = newValue.name;}
      //    if(newValue.cover) {track.cover = newValue.cover;}
      //    if(newValue.url) {track.url = newValue.url;}
      //    if(newValue.time) {track.time = newValue.time;}
      //    if(newValue.isPaused) {track.isPaused = newValue.isPaused;}
      //    if(newValue.isLoaded) {track.isLoaded = newValue.isLoaded;}
      //    if(newValue.isStarted) {track.isStarted = newValue.isStarted;}
      //    if(newValue.audioBufferFromUrl) {track.audioBufferFromUrl = newValue.audioBufferFromUrl;}
      //    if(newValue.audioBufferSourceNode) {track.audioBufferSourceNode = newValue.audioBufferSourceNode;}
      //    if(newValue.trackVolumeNode) {track.trackVolumeNode = newValue.trackVolumeNode;}
      //    if(newValue.startTime) {track.startTime = newValue.startTime;}
      //    if(newValue.lastTime) {track.lastTime = newValue.lastTime;}
      //    if(newValue.pauseTime) {track.pauseTime = newValue.pauseTime;}
      //    if(newValue.offsetTime) {track.offsetTime = newValue.offsetTime;}
      //    if(newValue.audioContext) {track.audioContext = newValue.audioContext;}
      //  }
      //  playingTrackList[index] = track;
      //  if(callback) {callback();}
      //};


      return Track;
    }
]);
