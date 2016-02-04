/**
 * Created by sth on 2/4/16.
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
