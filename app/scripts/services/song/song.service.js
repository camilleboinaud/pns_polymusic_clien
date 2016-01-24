'use strict';

/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: songFactory
 * @description
 * # songFactory: save all song data
 * a song, il contains some track files of mp3
 * Controller of the pnsPolymusicClientApp
 */

angular.module('pnsPolymusicClientApp').factory('songFactory', function () {
  return [
    {
      name: 'amy rehab',
      band: 'Queen',
      tracks: [
        {
          name: 'piano',
          url: '././music/amy_rehab/piano.mp3'
        },
        {
          name: 'bass',
          url: '././music/amy_rehab/basse.mp3'
        },
        {
          name: 'batterie',
          url: '././music/amy_rehab/batterie.mp3'
        },
        {
          name: 'cuivres',
          url: '././music/amy_rehab/cuivres.mp3'
        },
        {
          name: 'guitare',
          url: '././music/amy_rehab/guitare.mp3'
        },
        {
          name: 'orgue',
          url: '././music/amy_rehab/orgue.mp3'
        },
        {
          name: 'voix',
          url: '././music/amy_rehab/voix.mp3'
        }
      ]
    }
  ];
});
