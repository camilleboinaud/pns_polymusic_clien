/**
 * Created by sth on 1/17/16.
 */
'use strict';

angular.module('pnsPolymusicClientApp').factory('SongREST', ['$http', 'Upload',
  function ($http, Upload) {
    var SongREST= {},
      serverAddress = 'http://localhost:3000';

    SongREST.serverAddress = serverAddress;
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

    SongREST.getSongUrlById = function (ID) {
      return serverAddress+'/api/songs/'+ID;
    };

    SongREST.uploadSong = function (song, successCallback, errorCallback, progressCallback) {
      Upload.upload({
        url: serverAddress + '/api/songs',
        data: { songName:song.name, author:song.author, file: song.tracks}
      }).then(successCallback, errorCallback, progressCallback);
    };

    return SongREST;
  }
]);
