'use strict';

angular.module('pnsPolymusicClientApp').factory('songFactory', function () {
  return [
    {
      name: 'amy rehab',
      band: 'Queen',
      tracks: [
        {
          name: 'piano',
          url: 'http://192.168.43.219:3000/api/songs/569fb4cc41beec772adda858/tracks/569fb4cc41beec772adda859'
        },
        {
          name: 'bass',
          url: 'http://192.168.43.219:3000/api/songs/569fb4cc41beec772adda858/tracks/569fb4cc41beec772adda85a'
        }
      ]
    }
  ];
});
