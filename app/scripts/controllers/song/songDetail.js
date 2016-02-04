'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.controller:SongDetailCtrl
 * @description
 * # SongDetailCtrl
 * Controller of the pnsPolymusicClientApp
 */
angular.module('pnsPolymusicClientApp')
  .controller('SongDetailCtrl', function ($scope, $routeParams, SongREST, User, $document) {

    var limit = 10;
    $scope.currentPage = 1;

    /**
     * INIT: Get song's info by ID
     */
    SongREST.getSongUrlById($routeParams.songId, function (song) {
      $scope.song = song;
      $scope.rating = new Array( Math.ceil(song.rating));
      $scope.rating_vide  = new Array(5 - Math.ceil(song.rating));
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
        content: $scope.content,
        userId: User.getCurrentUser().id,
        userName: User.getCurrentUser().username
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

    //pour 5 etoils
    $scope.has_rated = [false, false, false, false, false];

    $scope.make_rating = function (nb) {
      for(var i =1; i<=nb; i++){
        $scope.has_rated[i-1] = true;
      }
      for(var i =nb+1; i<=5; i++){
        $scope.has_rated[i-1] = false;
      }
      var params = {
        songId: $scope.song._id,
        rating: nb,
        userId: User.getCurrentUser().id
      };
      //send rating to server
      SongREST.newRating(params, function (response) {
        console.info(response);
        $scope.rating = new Array(response.rating);
        $scope.rating_vide  = new Array(5 - response.rating);
      });
    }
  });
