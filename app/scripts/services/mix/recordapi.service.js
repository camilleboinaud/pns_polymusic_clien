'use strict';

angular.module('pnsPolymusicClientApp').factory('MixRecorder', ['$http', 'SERVER_ADDR', 'DurationService',
    function ($http, SERVER_ADDR, DurationService) {

        function MixRecorder(values, duration){
            this.storage = values;
            this.duration = duration;
        };

        /**
         * Saves a node value depending on main node's current time
         * (all values are stored on a sorted array indexed by sub-nodes
         * using the name parameter)
         * @param name
         * @param value
         * @returns {boolean} : true on success, else returns false
         */
        MixRecorder.prototype.saveNodeValue = function(name, value) {
            if (this.storage.hasOwnProperty(name)){
                this.storage[name].push({time: this.duration.currentPercent, value: parseInt(value)});
                this.storage[name].sort(function (a, b) {
                    return a.time - b.time;
                });
                return true;
            }
            return false;
        };

        /**
         * Retrieves node value to apply for current time
         * @param name
         * @returns {*} : value on success or false
         */
        MixRecorder.prototype.getNodeValue = function(name, defaultValue) {

            if (this.storage.hasOwnProperty(name)) {

                var previous;
                for (var e in this.storage[name]) {

                    if(this.storage[name][e] !== undefined){

                        if(this.storage[name][e].time < this.duration.currentPercent){
                            previous = this.storage[name][e];
                            continue;
                        } else if(previous !== undefined) {
                            return previous.value;
                        }

                        break;
                    }

                    break;
                }
                console.info("default");
                return defaultValue;

            }
        };



        return MixRecorder;

    }

]);
