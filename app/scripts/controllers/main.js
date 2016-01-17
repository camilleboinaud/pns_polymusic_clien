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

    $scope.playingMusic.url = 'http://localhost:3000/public/uploads/songs/Emeli Sandé - Read All About It, Pt. III.mp3';

    $scope.play = function () {
      // for changing the button icon from play to pause
      $scope.playingMusic.play();

    };


  }]);
