 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope','SongREST','$document','$timeout','$location',
     function ($scope, SongREST, $document, $timeout, $location) {

       $scope.progressPercentage =0;
       $scope.tracks = [];
       var inputElement = document.getElementById('uploadSong');
       $scope.hasNotif = false;

       var secondtoHHMMSS = function (second) {
         var hours   = Math.floor(second / 3600);
         var minutes = Math.floor((second - (hours * 3600)) / 60);
         var seconds = Math.floor(second - (hours * 3600) - (minutes * 60));

         if (hours   < 10) {hours   = '0'+hours;}
         if (minutes < 10) {minutes = '0'+minutes;}
         if (seconds < 10) {seconds = '0'+seconds;}
         if (hours == '00'){
           return minutes+':'+seconds;
         } else {
           return hours+':'+minutes+':'+seconds;
         }
       };

       $scope.submit = function() {
         if ($scope.trackFiles && $scope.songName) {
           var song = {
             name:$scope.songName,
             author:$scope.author,
             tracks: $scope.trackFiles
           };
           $scope.upload(song);
         }
       };


       /**
        * When add files
        */
       inputElement.onchange = function() {
         var callback = function(track){
           track.readableDuration = secondtoHHMMSS(track.duration);
           $scope.tracks[track.index] = track;
           $scope.$$phase || $scope.$apply(); // update view
         };

         $scope.trackFiles = inputElement.files;
         for (var i = 0; i < $scope.trackFiles.length; i++) {
           var track = {
             url: URL.createObjectURL($scope.trackFiles.item(i)),
             index: i,
             name: $scope.trackFiles.item(i).name
           };
           $scope.tracks.push(track);
           SongREST.getTrackDuration(track, callback);
         }
       };

       // upload on file select or drop
       $scope.upload = function (song) {

         SongREST.uploadSong(song, function (resp) {
           console.log('Success uploaded. Response: ' + resp.data.message);
           //afficher la notification de upload
           $scope.hasNotif = true;
           //apres 2 seconds close la notification et rediger au page index
           $timeout(function() {
             $scope.hasNotif = false;
             $location.path('/#/');
           }, 2000);

         }, function (resp) {
           console.log('Error status: ' + resp.status);
         }, function (evt) {
           $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
           var interval = setInterval(function() {
             $document.find("#progress-bar")
               .css("width", $scope.progressPercentage + "%")
               .attr("aria-valuenow", $scope.progressPercentage)
               .text($scope.progressPercentage + "%");
             if ($scope.progressPercentage >= 100){
               clearInterval(interval);
             }
           }, 0);
         });
       };



     }
 ]);
