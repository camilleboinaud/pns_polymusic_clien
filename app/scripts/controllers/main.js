'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('song')
  .controller('MainCtrl', ['$scope', 'Song', function ($scope,Song) {

    var audioContext = Song.initAudioContext();
    $scope.playingMusic = Song.newPlayingMusic(audioContext);

    $scope.playingMusic.url = 'http://localhost:3000/api/songs/569bd241b42136fd0d7ffeda';

    $scope.play = function () {
      // for changing the button icon from play to pause
      $scope.playingMusic.play();

    };


  }]);
