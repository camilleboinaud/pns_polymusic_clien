'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: track
 * @description
 * # track: make the track template of every track in the list with volume
 * service of the pnsPolymusicClientApp
 */


angular.module('pnsPolymusicClientApp').directive('track', function() {

  function trackController($scope, $element, $timeout, audioTrackFactory) {

    $scope.trackVolume = 100;
    $scope.loading = true;
    $scope.trackStereo = 0;

    var track = $scope.track;
    var canvas = $element[0].querySelector('canvas');
    var canvasWidth = 370;
    var canvasHeight = 100;
    var freqShowPercent = 0.75;
    var fftSize = 256;
    var freqCount = fftSize / 2;
    var freqDrawWidth = canvasWidth / (freqCount * freqShowPercent);
    var timeDrawWidth = canvasWidth / freqCount;
    var trackMuteVolume=0;
    $scope.trackReady=false;


    $scope.trackIsMute=false;
    var trackIsSolo=false;

    var audioTrack;
    var analyser;

    // convert seconds to human readable duration
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


    (function init() {
      audioTrack = audioTrackFactory.getNewAudioTrack({
        ctx: $scope.$parent.aCtx,
        useAudioTag: false,
        url: track.url,
        outNode: $scope.$parent.master.gainNode,
        fftSize: fftSize
      });

      audioTrack.loadAndDecode(updateStatus);
      initCanvas(canvas);

      $scope.$watch('trackVolume', function(value) {
        value = value / 100;
        audioTrack.setVolume(value);
        if(value !== 0) {
          $scope.trackIsMute=false;
        }
      });

      $scope.$watch('trackStereo', function(value) {
        audioTrack.setBalance(value);
      });

      $scope.trackReady=true;
    })();

    track.getAudioTrack = function() {
      return audioTrack;
    };

    track.getTrackIsSolo = function() {
      return trackIsSolo;
    };

    $scope.mute = function mute() {
      if($scope.trackIsMute === false) {
        var temp = $scope.trackVolume;
        audioTrack.setVolume(0);
        $scope.trackVolume = 0;
        trackMuteVolume = temp;
        $scope.trackIsMute = true;
      } else {
        audioTrack.setVolume(trackMuteVolume);
        $scope.trackVolume = trackMuteVolume;
        trackMuteVolume = 0;
        $scope.trackIsMute = false;
      }
    };

    $scope.soloTrack = function() {
      (trackIsSolo === false) ? trackIsSolo=true : trackIsSolo=false;
      $scope.$parent.solo();
    };

    function updateStatus(status) {
      if (status === 'ready') {
        $scope.loading = false;
        status = '';
        $scope.$parent.trackLoad($scope.key, track);
        // set duration
        $scope.duration = secondtoHHMMSS(audioTrack.duration);
      }

      $timeout(function() {
        $scope.status = status;
      });
    }


    //init the canvas with height, width and forme, color..
    function initCanvas(canvas) {
      track.canvas = canvas;
      track.canvas.width = canvasWidth;
      track.canvas.height = canvasHeight;

      track.cCtx = track.canvas.getContext('2d');

      var gradient = track.cCtx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0.15, '#e81717');
      gradient.addColorStop(0.75, '#7943cb');
      gradient.addColorStop(1, '#005392');
      track.cCtx.fillStyle = gradient;

      track.cCtx.strokeStyle = '#AAA';
    }


    // augment track object
    track.play = function() {
      audioTrack.play();
      analyser = audioTrack.analyser;
    };

    //stop the song
    track.stop = function() {
      audioTrack.stop();
    };

    track.clear = function() {
      audioTrack.clear();
    };


    //draw the canvas
    track.draw = function() {
      var ctx = track.cCtx;

      if (!analyser) {
        return;
      }

      var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(byteFreqArr);

      var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(timeDomainArr);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.beginPath();
      for (var i=0, iLen=byteFreqArr.length; i<iLen; i++) {
        ctx.fillRect(i * freqDrawWidth, canvasHeight - (byteFreqArr[i] / 256 * canvasHeight), (freqDrawWidth - 2), canvasHeight);

        var percent = timeDomainArr[i] / 256;
        var offset = canvasHeight - (percent * canvasHeight) - 1;
        ctx.lineTo(i * timeDrawWidth, offset);
      }
      ctx.stroke();
    };

    // get track duration
    track.getDuration = function() {
      return audioTrack.duration
    };

    // get readable track duration
    track.getReadableDuration = function() {
      return secondtoHHMMSS(audioTrack.duration);
    };

    track.setPauseTime = function (newPauseTime) {
      audioTrack.pauseTime = newPauseTime;
    };

    track.getPauseTime = function () {
      return audioTrack.pauseTime;
    }

  }

  //return the template of track
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      track: '=',
      trackName: '@'
    },
    templateUrl: 'scripts/directives/track/track.html',
    controller: trackController
  };
});
