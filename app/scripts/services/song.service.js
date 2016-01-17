/**
 * Created by sth on 1/5/16.
 */
'use strict';

// For controlling playing music between PlayerCtr and PlaylistCtr
angular.module('song').factory('Song', ['$window',
    function ($window) {

        var Music = {},
            nbPlayingMusic = 0,
            playingMusicStack = [];

        /**
         * This is constructor of PlayingMusic
         * @param audioContext
         * @param initValue
         * @constructor
         */
        function PlayingMusic(audioContext, initValue){
            this.index = nbPlayingMusic;
            nbPlayingMusic++;
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

            playingMusicStack.push(this);
        }

        /**
         * Create a new PlayingMusic
         * @param audioContext
         * @param initValue
         * @returns {PlayingMusic}
         */
        Music.newPlayingMusic = function(audioContext, initValue){
            return new PlayingMusic(audioContext, initValue);
        };


        /**
         * Initialise the Audio Context
         * @returns the Audio Context
         */
        Music.initAudioContext = function initAudioContext() {
            // There can be only one!
            var AudioContext = $window.AudioContext || $window.webkitAudioContext,
                ctx = new AudioContext();

            if(ctx === undefined) {
                throw new Error('AudioContext is not supported. :(');
            }
            return ctx;
        };

      Music.getNbPlayingMusic = function getNbPlayingMusic() {
        return playingMusicStack;
      };



        /**
         * This function is defined as a prototype of PlayingMusic: Load sound from url
         * @param url
         * @param successCallback
         * @param errorCallback
         */
        PlayingMusic.prototype.loadSound = function loadSound(url, successCallback, errorCallback) {
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
                      // save the audioBuffer into playingMusic which we will use for resuming
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
         * This function is defined as a prototype of PlayingMusic: play music
         * @param successCallback: success callback
         * @param errorCallback: error callback
         */
        PlayingMusic.prototype.play = function play(successCallback, errorCallback) {
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
        PlayingMusic.prototype.pause = function pause(successCallback,errorCallback){
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



        Music.getAllPlayingMusic = function() {
            return playingMusicStack;
        };

        Music.getPlayingMusicAt = function(index) {
            if(index >= playingMusicStack.length ){
                return;
            }
            return playingMusicStack[index];
        };

        Music.updatePlayingMusicAt = function(index, newValue, callback) {
            if(index >= playingMusicStack.length ){
                return;
            }
            var music = playingMusicStack[index];
            if(newValue){
                if(newValue.name) {music.name = newValue.name;}
                if(newValue.cover) {music.cover = newValue.cover;}
                if(newValue.url) {music.url = newValue.url;}
                if(newValue.time) {music.time = newValue.time;}
                if(newValue.isPaused) {music.isPaused = newValue.isPaused;}
                if(newValue.isLoaded) {music.isLoaded = newValue.isLoaded;}
                if(newValue.isStarted) {music.isStarted = newValue.isStarted;}
                if(newValue.audioBufferFromUrl) {music.audioBufferFromUrl = newValue.audioBufferFromUrl;}
                if(newValue.audioBufferSourceNode) {music.audioBufferSourceNode = newValue.audioBufferSourceNode;}
                if(newValue.trackVolumeNode) {music.trackVolumeNode = newValue.trackVolumeNode;}
                if(newValue.startTime) {music.startTime = newValue.startTime;}
                if(newValue.lastTime) {music.lastTime = newValue.lastTime;}
                if(newValue.pauseTime) {music.pauseTime = newValue.pauseTime;}
                if(newValue.offsetTime) {music.offsetTime = newValue.offsetTime;}
                if(newValue.audioContext) {music.audioContext = newValue.audioContext;}
            }
            playingMusicStack[index] = music;
            if(callback) {callback();}
        };


        return Music;
    }
]);
