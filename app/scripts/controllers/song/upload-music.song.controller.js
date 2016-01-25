 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope', '$timeout', '$window', 'REST',
     function ($scope, $timeout, $window, REST) {

       $scope.submit = function() {
         console.log('submit');
         if ($scope.tracks && $scope.songName) {
           var song = {
             name:$scope.songName,
             tracks: $scope.tracks
           };
           console.log(song);
           $scope.upload(song);
         }
       };

       var inputElement = document.getElementById('uploadSong');
       inputElement.onchange = function() {
         $scope.tracks = inputElement.files;
         //TODO do something with fileList.
       };

       // upload on file select or drop
       $scope.upload = function (song) {

         REST.uploadSong(song, function (resp) {
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
