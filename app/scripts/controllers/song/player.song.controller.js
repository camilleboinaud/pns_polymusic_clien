/**
 * Created by sth on 1/4/16.
 */
'use strict';
/**
 *
 */
<<<<<<< HEAD
angular.module('song').controller('PlayerController', ['$scope', '$window', 'songFactory',
    function ($scope, $window, songFactory) {

      //var audioContext = songFactory.initAudioContext();
      //
      //$scope.playingMusic = songFactory.newPlayingSong(audioContext);
      //$scope.isLoaded = false;
      //$scope.isPaused = true;


      //$scope.playingMusic.url = '/Users/sth/develope/polytech/pns_web/pns_polymusic_server/public/uploads/Adele - Hello.mp3';
      //
      //$scope.safeApply = function(fn) {
      //  var phase = this.$root.$$phase;
      //  if(phase === '$apply' || phase === '$digest') {
      //    if(fn && (typeof(fn) === 'function')) {
      //      fn();
      //    }
      //  }else {
      //    this.$apply(fn);
      //  }
      //};
      //
      //
      //
      //$scope.play = function () {
      //  // for changing the button icon from play to pause
      //  $scope.playingMusic.play(function(){
      //    $scope.safeApply(function(){
      //      $scope.isLoaded = $scope.playingMusic.isLoaded;
      //      $scope.isPaused = $scope.playingMusic.isPaused;
      //    });
      //  });
      //
      //};
      //
      //$scope.pause = function () {
      //  $scope.playingMusic.pause(function() {
      //    $scope.safeApply(function(){
      //      $scope.isLoaded = $scope.playingMusic.isLoaded;
      //      $scope.isPaused = $scope.playingMusic.isPaused;
      //    });
      //  });
      //};
      //
      //$scope.stop = function () {
      //  console.log('stop music');
      //};
=======
angular.module('song').controller('PlayerController', ['$scope', '$window', 'SongService',
    function ($scope, $window, SongService) {

      // init audio context
      var audioContext = SongService.initAudioContext();

      $scope.playingSong = SongService.getNewSong(audioContext);
      $scope.isLoaded = false;
      $scope.isPaused = true;

      $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        }else {
          this.$apply(fn);
        }
      };



      $scope.play = function () {
        // the callback is out of Angular Context, so we should manually update view
        $scope.playingSong.play(function(){
          $scope.safeApply(function(){
            $scope.isLoaded = $scope.playingSong.isLoaded;
            $scope.isPaused = $scope.playingSong.isPaused;
          });
        });

      };

      $scope.pause = function () {
        $scope.playingSong.pause(function() {
          $scope.safeApply(function(){
            $scope.isLoaded = $scope.playingSong.isLoaded;
            $scope.isPaused = $scope.playingSong.isPaused;
          });
        });
      };

      $scope.stop = function () {
        console.log('stop music');
      };
>>>>>>> de05ba4c4fa27fb6011b780eb42baa8f2a7686e8

    }
]);
