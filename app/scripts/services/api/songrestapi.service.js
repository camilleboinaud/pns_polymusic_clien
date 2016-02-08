/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: SongREST
 * @description
 * # SongREST: interfaces of server
 */

'use strict';

angular.module('pnsPolymusicClientApp').factory('SongREST', ['$http', 'Upload', 'AudioContextService',
  function ($http, Upload, AudioContextService) {
    var SongREST= {},
      serverAddress = 'http://localhost:3000',
      audioContext = AudioContextService.getContext();

    SongREST.serverAddress = serverAddress;

      /**
       * Get list of pub songs
       * @param params
       * @param callback
       */
    SongREST.getAllPubSongs = function (params, callback) {
      $http({
        method: 'GET',
        url: serverAddress + '/api/songs?userId=' + params.userId
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
        data: { songName:song.name, author:song.author, owner:song.owner, file: song.tracks}
      }).then(successCallback, errorCallback, progressCallback);
    };


    /**
     * Get all song's comments
     * @param params
     * @param callback
       */
    SongREST.getAllCommentsBySongId = function (params, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/songs/'+params.songId+'/comments?limit='+params.limit+'&lastTimeChamps='+params.lastTimeChamps+'&pageIndex='+params.pageIndex
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get number of song's comments
     * @param params
     * @param callback
     */
    SongREST.getNbCommentBySongId = function (params, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/songs/'+params.songId+'/ngComment'
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
        data: params
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
        url: serverAddress+'/api/songs/?string='+params.search_text+'&isSong='+params.isSong+'&userId='+ params.userId
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
    * Get page numbers
    * @param params
    * @param callback
    */
    SongREST.getNbCommentPages = function (params, callback) {
      $http({
        method: 'GET',
        url: serverAddress+'/api/comments/pages?songId='+params.songId+'&limit='+params.limit
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };


    /**
     * Get Track's duration by url
     * @param track
     * @param callback
     */
    SongREST.getTrackDuration = function (track, callback){
      $http
        .get(track.url,{responseType: 'arraybuffer'})
        .then(function successCallback(response){
          audioContext.decodeAudioData(response.data, function(buffer) {
            track.duration = buffer.duration;
            callback(track);
          });
        }, function errorCallback(error) {
          console.log(error);
        });
    };

    /**
     * Rate a song
     * @param params: songId, rating, userId
     * @param callback
     */
    SongREST.newRating = function (params, callback){
      $http({
        method: 'POST',
        url: serverAddress+'/api/ratings',
        data: params
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get user's songs
     * @param params: userId
     * @param callback
     */
    SongREST.getSongsByUser = function (params, callback){
      $http({
        method: 'GET',
        url: serverAddress+'/api/users/'+params.userId+'/songs'
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get user's songs
     * @param params: userId, songId
     * @param callback
     */
    SongREST.deleteSongById = function (params, callback){
      $http({
        method: 'DELETE',
        url: serverAddress+'/api/songs/'+params.songId+'?userId='+params.userId
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get user's songs
     * @param params: userId, songId, isPub
     * @param callback
     */
    SongREST.updateSongById = function (params, callback){
      $http({
        method: 'PUT',
        url: serverAddress+'/api/songs/'+params.songId,
        data: {userId: params.userId, isPub: params.isPub}
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    /**
     * Get my rating info
     * @param params: userId, songId
     * @param callback
       */
    SongREST.getMyRating = function (params, callback){
      $http({
        method: 'GET',
        url: serverAddress+'/api/ratings?userId='+params.userId+'&songId='+params.songId
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };



    return SongREST;
  }
]);
