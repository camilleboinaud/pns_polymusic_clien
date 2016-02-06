'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('MainCtrl', ['$scope','SongREST', '$document', 'DurationService', 'User', 'AudioContextService', function ($scope, SongREST, $document, DurationService ,User, AudioContextService) {

    $scope.currentSongs = [{
      ready: false,
      playing: false,
      readableDuration: '00:00',
      timer: null
    },{
      ready: false,
      playing: false,
      readableDuration: '00:00'
    }];

    $scope.masters = [{},{}];
    $scope.aCtx = null;

    initAudio();

    function initAudio() {
      $scope.aCtx = AudioContextService.getContext();
      $scope.aCtx.createGain = $scope.aCtx.createGain || $scope.aCtx.createGainNode;

      $scope.masters.forEach(function (master) {
        master.gainNode = $scope.aCtx.createGain();
        master.gainNode.connect($scope.aCtx.destination);
      });

    }
    var userId="";
    if (User.getCurrentUser()) {
      userId = User.getCurrentUser().id
    }
    SongREST.getAllPubSongs({userId:userId}, function(songs){
      $scope.songs = songs;
    });

    /**
     * Get song list by search_text
     * @param isASong boolean
     */
    $scope.search = function (isASong) {
      var params = {
        search_text: $scope.search_song,
        isSong: isASong,
        userId: User.getCurrentUser().id
      };
      SongREST.searchSong(params, function (data) {
        $scope.songs = data;
      });
    };

    var playingSongAIndex,
      playingSongBIndex;

    $scope.playSongOnA = function (index) {
      if(playingSongAIndex !== undefined){
        $scope.songs[playingSongAIndex].selected = false;
      }
      playingSongAIndex = index;
      $scope.songs[index].selected = true;
    };

    $scope.playSongOnB = function (index) {
      if (playingSongBIndex !== undefined) {
        $scope.songs[playingSongBIndex].selected = false;
      }
      playingSongBIndex = index;
      $scope.songs[index].selected = true;
    };

  }]);
