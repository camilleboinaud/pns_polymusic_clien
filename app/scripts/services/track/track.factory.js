'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: audioTrackFactory
 * @description
 * # audioTrackFactory: une instance of audio track
 * Controller of the pnsPolymusicClientApp
 */


angular.module('pnsPolymusicClientApp').factory('audioTrackFactory', function ($http) {

  function AudioTrack(cfg) {
    this.ctx = cfg.ctx;
    this.useAudioTag = cfg.useAudioTag;
    this.url = cfg.url;
    this.outNode = cfg.outNode;
    this.fftSize = cfg.fftSize;
  }

  AudioTrack.prototype.addGainNode = function (node) {
    var gainNode = this.ctx.createGain();
    node.connect(gainNode);
    gainNode.connect(this.outNode);

    return gainNode;
  };

  AudioTrack.prototype.createAnalyser = function(node) {
    var analyser = this.ctx.createAnalyser();
    analyser.smoothingTimeConstant = 0.6;
    analyser.fftSize = this.fftSize;

    node.connect(analyser);

    return analyser;
  };

  AudioTrack.prototype.loadAndDecode = function(statusCallback) {
    var self = this;
    if (self.useAudioTag) {
      var audio = new Audio(self.url);
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('canplaythrough', function(e) {
        self.node = self.ctx.createMediaElementSource(audio);
        self.splitNode = self.ctx.createChannelSplitter(2);
        self.mergeNode = self.ctx.createChannelMerger(2);
        self.rightVolumeNode = self.ctx.createGain();
        self.leftVolumeNode = self.ctx.createGain();

        self.node.connect(self.splitNode);
        self.splitNode.connect(self.leftVolumeNode, 0);
        self.splitNode.connect(self.rightVolumeNode, 1);
        self.leftVolumeNode.connect(self.mergeNode, 0, 0);
        self.rightVolumeNode.connect(self.mergeNode, 0, 1);
        self.gainNode = self.addGainNode(self.mergeNode);
        self.analyser = self.createAnalyser(self.gainNode);

        statusCallback('ready');
      });

      self.audio = audio;
    } else {
      if (self.buffer) { // already loaded
        self. pauseTime = null;
        statusCallback('ready');
        return;
      }
      statusCallback('loading');

      $http
        .get(this.url, {
          responseType: 'arraybuffer'
        })
        .then(function(response) {
          statusCallback('decoding');
          self.ctx.decodeAudioData(response.data, function(buffer) {
            self.buffer = buffer;
            self.duration = buffer.duration;
            statusCallback('ready');
          });
        });

    }
  };

  AudioTrack.prototype.play = function() {
    if (this.useAudioTag) {
      this.audio.play();
    } else {
      this.playBuffer();
    }
  };

  AudioTrack.prototype.stop = function() {
    if (this.useAudioTag) {
      this.audio.pause();
    } else {
      this.bsNode.stop(0);
      this.pauseTime = this.ctx.currentTime - this.startTime;
    }
  };

  AudioTrack.prototype.setVolume = function(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  };

  AudioTrack.prototype.setBalance = function(value) {
    if(this.splitNode) {
      if (value == 0) {
        this.leftVolumeNode.gain.value = 1;
        this.rightVolumeNode.gain.value = 1;
      } else if (value == 1) {
        this.leftVolumeNode.gain.value = 0;
        this.rightVolumeNode.gain.value = 1;
      } else {
        this.leftVolumeNode.gain.value = 1;
        this.rightVolumeNode.gain.value = 0;
      }
    }
  };


  AudioTrack.prototype.playBuffer = function() {
    this.bsNode = this.ctx.createBufferSource();
    this.bsNode.buffer = this.buffer;

    var bufferOffset = this.pauseTime || 0;
    this.startTime = this.ctx.currentTime;
    if (this.pauseTime) {
      this.startTime -= this.pauseTime;
    }

    this.bsNode.start(0, bufferOffset);
    this.gainNode = this.addGainNode(this.bsNode, this.outNode);
    this.analyser = this.createAnalyser(this.gainNode, this.fftSize);
  };

  AudioTrack.prototype.clear = function() {
    if (this.audio) {
      this.audio.src = '';
    }
  };


  return {
    getNewAudioTrack: function() {
      var instance = Object.create(AudioTrack.prototype);
      AudioTrack.apply(instance, arguments);

      return instance;
    }
  };
});
