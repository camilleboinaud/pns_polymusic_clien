/**
 * Created by sth on 2/1/16.
 */
'use strict';
angular.module('pnsPolymusicClientApp')
  .factory('DurationService', ['$interval',
  function ($interval) {

    var DurationService = {},
      intervalTime = 1;

    function Duration(init){
      this.totalTime = init.totalTime;
      this.currentPercent = 0;
      if(init.currentPercent) { this.currentPercent = init.currentPercent;}
    }

    Duration.prototype.startTimer = function (processCallback) {
      var me = this;
      me.timer = $interval(function(){
        me.currentPercent +=  intervalTime / me.totalTime * 100;
        if(me.currentPercent >= 100){
          me.currentPercent = 100;
          me.stopTimer();
        }
        console.log(me.currentPercent);
        if(processCallback) {processCallback(me.currentPercent)}
      },intervalTime*1000)
    };

    Duration.prototype.pauseTimer = function () {
      var me = this;
      $interval.cancel(me.timer);
      delete me.timer;
    };


    Duration.prototype.stopTimer = function () {
      console.log('stop');
      var me = this;
      $interval.cancel(me.timer);
      delete me.timer;
      me.currentPercent = 0;
    };

    DurationService.getNewDuration = function (init) {
      return new Duration(init)
    };

    return DurationService;

}]);
