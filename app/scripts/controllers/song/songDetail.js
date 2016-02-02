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

    var limit = 10;
    $scope.currentPage = 1;

    /**
     * INIT: Get song's info by ID
     */
    SongREST.getSongUrlById($routeParams.songId, function (song) {
      $scope.song = song;
    });


    var getAllComments = function (params) {
      params.songId = $routeParams.songId;
      params.limit = limit;
      SongREST.getAllCommentsBySongId(params, function (comments) {
        $scope.comments = comments;
      });

      SongREST.getNbCommentBySongId(params, function (response) {
        $scope.nbComment = response.nbComment;
      });

      SongREST.getNbCommentPages(params, function (response) {
        $scope.nbPage = new Array(response.nbPages);
      });

    };

    $scope.newComment = function () {
      console.log('newComment');
      var params = {
        songId: $routeParams.songId,
        content: $scope.content
      };
      SongREST.writeNewComments(params, function (response) {
        getAllComments({limit:limit});
        $scope.content = '';
      })
    };

    $scope.selectPage = function (number, event) {
      $scope.currentPage = number;
      getAllComments({limit:limit, pageIndex:number});
    };

    var getNbPages = function () {
      var params = {
        songId: $routeParams.songId,
        limit: limit
      };
      SongREST.getNbCommentPages(params, function (response) {
        $scope.nbPage = new Array(response.nbPages);
      })
    };

    getNbPages();
    getAllComments({limit:limit});

  });
