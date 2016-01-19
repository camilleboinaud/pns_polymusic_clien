/**
 * Created by sth on 1/17/16.
 */
'use strict';

angular.module('pnsPolymusicClientApp').factory('REST', ['$http', 'Upload',
  function ($http, Upload) {
    var REST= {},
      serverAddress = 'http://localhost:3000';

    REST.serverAddress = serverAddress;
    REST.getAllPubSongs = function (callback) {
      $http({
        method: 'GET',
        url: serverAddress + '/api/songs?is_pub=true'
      }).then(function successCallback(response){
        callback(response.data);
      }, function errorCallback(error) {
        console.log(error);
      });
    };

    REST.getSongUrlById = function (ID) {
      return serverAddress+'/api/songs/'+ID;
    };

    REST.uploadSong = function (file, successCallback, errorCallback, progressCallback) {
      Upload.upload({
        url: serverAddress + '/api/songs',
        data: {file: file}
      }).then(successCallback, errorCallback, progressCallback);
    };

    return REST;
  }
]);
