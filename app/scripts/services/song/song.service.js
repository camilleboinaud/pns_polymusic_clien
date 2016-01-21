'use strict';


angular.module('pnsPolymusicClientApp').factory('songFactory', function () {
  return [
    {
      name: 'amy rehab',
      band: 'Queen',
      tracks: [
        {
          name: 'piano',
          url: 'http://localhost:9000/music/queen_champions/voix.mp3'
        },
        {
          name: 'bass',
          url: 'http://localhost:9000/music/queen_champions/basse.mp3'
        }
      ]
    }
  ];
});

//angular.module('song').factory('SongService', ['SongModel', '$window', function (SongModel, $window) {
//  var SongService = {},
//    songList = [];
//
//
//
//  SongService.getNewSong = function (audioContext, initValue) {
//    var songModel = new SongModel(audioContext, initValue);
//    songList.push(songModel);
//    return songModel;
//  };
//
//
//  /**
//   * Initialise the Audio Context
//   * @returns the Audio Context
//   */
//  SongService.initAudioContext = function initAudioContext() {
//    // There can be only one!
//    var AudioContext = $window.AudioContext || $window.webkitAudioContext,
//      ctx = new AudioContext();
//
//    if(ctx === undefined) {
//      throw new Error('AudioContext is not supported. :(');
//    }
//    return ctx;
//  };
//
//
//  SongService.getAllSongs = function() {
//    return songList;
//  };
//
//  SongService.getSongAtPlayer = function(index) {
//    if(index >= songList.length ){
//      return;
//    }
//    return songList[index];
//  };
//
//  SongService.updateSongAtPlayer = function(index, newValue, callback) {
//    if(index >= songList.length || !newValue){
//      return;
//    }
//    var oldSong = songList[index];
//    oldSong.resetByNewValue(oldSong,newValue);
//    songList[index] = oldSong;
//    if(callback) {callback();}
//  };
//
//  return SongService;
//
//
//}]);
