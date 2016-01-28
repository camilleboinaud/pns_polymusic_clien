'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:SongDetailCtrl
 * @description
 * # SongDetailCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('SongDetailCtrl', function ($scope, $routeParams, SongREST) {

    /**
     * INIT: Get song's info by ID
     */
    SongREST.getSongUrlById($routeParams.songId, function (song) {
      $scope.song = song;
    });


    var getAllComments = function () {
      SongREST.getAllCommentsBySongId($routeParams.songId, function (comments) {
        $scope.comments = comments;
        $scope.nbComment = comments.length;
      });
    };
    getAllComments();

    $scope.newComment = function () {
      console.log('newComment');
      var params = {
        songId: $routeParams.songId,
        content: $scope.content
      };
      SongREST.writeNewComments(params, function (response) {
        console.log(response);
        getAllComments();
        $scope.content = '';
      })
    }





  });
