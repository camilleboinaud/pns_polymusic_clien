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

    //$scope.ready = false;
    //$scope.playing = false;
    //$scope.trackWidth = 0;
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

    //initAudio();
    var userId="";
    if (User.getCurrentUser()) {
      userId = User.getCurrentUser().id
    }
    SongREST.getAllPubSongs({userId:userId}, function(songs){
      $scope.songs = songs;
    });
    //
    //$scope.$watch('currentSongs', function(currentSong, oldSong) {
    //  console.log('main currentSongs[0] changed');
    //});

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

  }]);
