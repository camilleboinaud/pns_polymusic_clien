/**
 * Created by sth on 1/4/16.
 */
'use strict';
/**
 *
 */
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

    }
]);
