'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: songFactory
 * @description
 * # songFactory: save all song data
 * a song, il contains some track files of mp3
 * Controller of the pnsPolymusicClientApp
 */

angular.module('pnsPolymusicClientApp').factory('songFactory', function (SongREST) {

  var songFactory = {};

  songFactory.getAllPubSongs = function getAllPubSongs(params, callback){
    SongREST.getAllPubSongs(params, function(songs){
      callback(songs);
    });
  };

  return songFactory;




});
