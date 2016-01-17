/**
 * Created by sth on 1/4/16.
 */
'use strict';
/**
 *
 */
angular.module('song').controller('PlayerController', ['$scope', '$state', '$window', 'Song',
    function ($scope, $state, $window, Song) {

        var audioContext = Song.initAudioContext();
            $scope.playingMusic = Song.newPlayingMusic(audioContext);
        console.info($scope.playingMusic);
        $scope.isLoaded = false;
        $scope.isPaused = true;

        //$scope.playingMusic.url = 'modules/music/music/upload/1452586098334-The Royal Concept - On Our Way.mp3';

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
            // for changing the button icon from play to pause
            $scope.playingMusic.play(function(){
                $scope.safeApply(function(){
                    $scope.isLoaded = $scope.playingMusic.isLoaded;
                    $scope.isPaused = $scope.playingMusic.isPaused;
                });
            });

        };

        $scope.pause = function () {
            $scope.playingMusic.pause(function() {
                $scope.safeApply(function(){
                    $scope.isLoaded = $scope.playingMusic.isLoaded;
                    $scope.isPaused = $scope.playingMusic.isPaused;
                });
            });
        };

        $scope.stop = function () {
            console.log('stop music');
        };

    }
]);
