 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope', '$timeout', '$window', 'REST',
     function ($scope, $timeout, $window, REST) {

       $scope.musicName = '';

       $scope.submit = function() {
         if ($scope.file) {
           $scope.upload($scope.file);
         }
       };

       // upload on file select or drop
       $scope.upload = function (file) {

         REST.uploadSong(file, function (resp) {
             console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
           }, function (resp) {
             console.log('Error status: ' + resp.status);
           }, function (evt) {
             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
           }
         );

       };
     }
 ]);
