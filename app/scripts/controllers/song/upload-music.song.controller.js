 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope','SongREST',
     function ($scope, SongREST) {
       
       $scope.progressPercentage =0;

       $scope.submit = function() {
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

         SongREST.uploadSong(song, function (resp) {
             console.log('Success uploaded. Response: ' + resp.data.message);
           }, function (resp) {
             console.log('Error status: ' + resp.status);
           }, function (evt) {
              $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
           }
         );

       };
     }
 ]);
