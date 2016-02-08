/**
 * @ngdoc function
 * @name pnsPolymusicClientApp.services: AudioContextService
 * @description
 * # AudioContextService: audio context
 */

'use strict';
angular.module('pnsPolymusicClientApp').factory('AudioContextService', function() {
  var AudioContextService = {},
    context = new window.AudioContext();

  AudioContextService.getContext = function () {
    return context;
  };

  return AudioContextService;

});
