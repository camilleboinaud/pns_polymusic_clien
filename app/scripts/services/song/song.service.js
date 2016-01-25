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
      id: 0,
      name: 'amy rehab',
      band: 'Queen',
      song: '././music/amy_rehab/song.mp3',
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
    },
    {
      id: 1,
      name: 'bob love',
      band: 'Queen',
      tracks: [
        {
          name: 'basse',
          url: '././music/bob_love/basse.mp3'
        },
        {
          name: 'choeurs1',
          url: '././music/bob_love/choeurs1.mp3'
        },
        {
          name: 'choeurs2',
          url: '././music/bob_love/choeurs2.mp3'
        },
        {
          name: 'extra',
          url: '././music/bob_love/extra.mp3'
        },
        {
          name: 'guitare1',
          url: '././music/bob_love/guitare1.mp3'
        },
        {
          name: 'guitare2',
          url: '././music/bob_love/guitare2.mp3'
        },
        {
          name: 'guitare3',
          url: '././music/bob_love/guitare3.mp3'
        },
        {
          name: 'guitare3',
          url: '././music/bob_love/guitare3.mp3'
        },
        {
          name: 'oooh',
          url: '././music/bob_love/oooh.mp3'
        },
        {
          name: 'orgue',
          url: '././music/bob_love/orgue.mp3'
        },
        {
          name: 'piano',
          url: '././music/bob_love/piano.mp3'
        },
        {
          name: 'rythme',
          url: '././music/bob_love/rythme.mp3'
        },
        {
          name: 'saxo',
          url: '././music/bob_love/saxo.mp3'
        },
        {
          name: 'trombone',
          url: '././music/bob_love/trombone.mp3'
        },
        {
          name: 'voix',
          url: '././music/bob_love/voix.mp3'
        }

      ]
    }
  ];
});
