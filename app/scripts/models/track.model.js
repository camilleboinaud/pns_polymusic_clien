/**
 * Created by sth on 1/19/16.
 */

'use strict';

angular.module('song').factory('TrackModel', [function () {



  function resetByNewValue(me,newValue) {
    // default value
    me.name = 'unknown';
    me.url = '';
    me.time = {min:'00', sec:'00'};
    // change by initValue
    if (newValue){
      if (newValue.index) {me.index = newValue.index;}
      if (newValue.url) {me.url = newValue.url;}
      if (newValue.time) {me.time = newValue.time;}
    }

    me.isPaused = true;
    me.isLoaded = false;
    me.isStarted = false;
    me.audioBufferFromUrl = null;
    me.audioBufferSourceNode = null;
    me.trackVolumeNode = null;
    me.startTime = 0;
    me.lastTime = 0;
    me.pauseTime = 0;// pause duration
    me.offsetTime = 0;// play duration
  }


  /**
   * This is constructor of TrackModel
   * @param audioContext
   * @param initValue
   * @constructor
   */
  var TrackModel = function (audioContext, initValue){

    var me = this;
    me.audioContext = audioContext; // get audio context
    resetByNewValue(me, initValue);
  };

  TrackModel.prototype.resetByNewValue = resetByNewValue;


    /**
     * This function is defined as a prototype of PlayingTrack: Load sound from url
     * @param url
     * @param successCallback
     * @param errorCallback
     */
    TrackModel.prototype.loadSound = function loadSound(url, successCallback, errorCallback) {
      var request = new XMLHttpRequest(),
        me = this;
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // onload music
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

      // handle error
      request.onerror = errorCallback;
      request.send();
    };

    /**
     * This function is defined as a prototype of PlayingTrack: play music
     * @param successCallback: success callback
     * @param errorCallback: error callback
     */
    TrackModel.prototype.play = function play(successCallback, errorCallback) {
      console.log('play music');
      var me = this,
        playSoundSuccess = function(result){
          // mark start
          if(!me.isStarted){
            me.startTime = me.audioContext.currentTime;
            me.lastTime = me.startTime;
            me.isStarted = true;
          }
          me.isPaused = false;
          me.audioBufferSourceNode = result.audioBufferSourceNode;
          me.trackVolumeNode = result.trackVolumeNode;
          if(successCallback) {successCallback();}
        };

      if(!me.isLoaded){
        // if it is not loaded, then start loading sound
        me.loadSound(me.url,function(){
          playSoundFromAudioBuffer(me,playSoundSuccess);
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
          if (me.isStarted){
            me.pauseTime = me.audioContext.currentTime - me.lastTime;
          } else {
            me.pauseTime = 0;
          }

          //playAfterPause(me.audioBufferSourceNode,me.offsetTime);
          playSoundFromAudioBuffer(me,playSoundSuccess);
        }
      }
    };


    /**
     * pause music
     * @param successCallback: success callback
     * @param errorCallback: error callback
     */
    TrackModel.prototype.pause = function pause(successCallback,errorCallback){
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
     * Play sound from audioBuffer: This is a private function
     * @param params: audioContext,audioBuffer,offsetTime
     * @param callback
     */
    function playSoundFromAudioBuffer(params,callback) {
      var audioBufferSourceNode,
        trackVolumeNode,
        audioContext = params.audioContext,
        audioBuffer = params.audioBufferFromUrl,
        offsetTime = params.offsetTime,

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

      if (callback) {
        callback(
          {
            trackVolumeNode: trackVolumeNode,
            audioBufferSourceNode: audioBufferSourceNode
          });
      }
    }


    return TrackModel;

  }
]);
