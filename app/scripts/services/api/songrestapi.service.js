/**
 * Created by sth on 1/17/16.
 */
'use strict';

angular.module('pnsPolymusicClientApp').factory('SongREST', ['$http', 'Upload',
  function ($http, Upload) {
    var SongREST= {},
      serverAddress = 'http://localhost:3000';

    SongREST.serverAddress = serverAddress;

      /**
       * Get list of pub songs
       * @param callback
       */
    SongREST.getAllPubSongs = function (callback) {
      $http({
        method: 'GET',
        url: serverAddress + '/api/songs'//?is_pub=true
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get song by ID
     * @param ID
     * @param callback
       */
    SongREST.getSongUrlById = function (ID, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/songs/'+ID
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Upload song with multi tracks
     * @param song
     * @param successCallback
     * @param errorCallback
     * @param progressCallback
       */
    SongREST.uploadSong = function (song, successCallback, errorCallback, progressCallback) {
      Upload.upload({
        url: serverAddress + '/api/songs',
        data: { songName:song.name, author:song.author, file: song.tracks}
      }).then(successCallback, errorCallback, progressCallback);
    };


    /**
     * Get all song's comments
     * @param ID
     * @param callback
       */
    SongREST.getAllCommentsBySongId = function (ID, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/songs/'+ID+'/comments'
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Write new comment for a song
     * @param params
     * @param callback
     */
    SongREST.writeNewComments = function (params, callback) {
      $http({
        method: 'POST',
        url: serverAddress+'/api/comments',
        data:{songId: params.songId, content:params.content}
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get song list bu search_text
     * @param params
     * @param callback
     */
    SongREST.searchSong = function (params, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/songs/?string='+params.search_text+'&isSong='+params.isSong
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };


    return SongREST;
  }
]);
