'use strict';
angular.module('pnsPolymusicClientApp').directive('masterGain', function() {
  function masterGainController($scope){
    $scope.masterGain = 100;

    $scope.$watch('masterGain', function(value) {
      $scope.master.gainNode.gain.value = value / 100;
    });

  }

  //return the template of player-slider
  return {
    restrict: 'EA',
    scope: {
      master: '='
    },
    templateUrl: 'scripts/directives/masterGain/masterGain.html',
    controller: masterGainController
  };

});
