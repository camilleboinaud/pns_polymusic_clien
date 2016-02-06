 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope','SongREST','$document','$timeout','$location','User',
     function ($scope, SongREST, $document, $timeout, $location, User) {

       $scope.progressPercentage =0;
       $scope.tracks = [];
       $scope.trackFiles = [];
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
             owner:User.getCurrentUser().id,
             tracks: $scope.trackFiles
           };
           $scope.upload(song);
         }
       };

       $scope.cancel = function () {
         $scope.trackFiles = [];
         $scope.tracks = [];
         $scope.uploadFiles = [];
       };


       /**
        * When add files
        */
       $scope.$watch('uploadFiles', function (files) {
         var callback = function(track){
           $scope.$apply(function() {
             $scope.tracks[track.index].readableDuration = secondtoHHMMSS(track.duration);
           });
         };
         // clean trackFiles
         $scope.trackFiles = [];
         $scope.tracks = [];
         var index = 0;
         if (files) {
           for (var i = 0; i < files.length; i++) {
             var trackFile = files.item(i);
             if (trackFile.type.indexOf('audio') != -1){
               var track = {
                 url: URL.createObjectURL(trackFile),
                 name: trackFile.name,
                 index: index
               };
               $scope.tracks.push(track);
               $scope.trackFiles.push(trackFile);
               SongREST.getTrackDuration(track, callback);
               index++;
             }
           }
         }
       });

       // upload on file select or drop
       $scope.upload = function (song) {

         SongREST.uploadSong(song, function (resp) {
           console.log('Success uploaded. Response: ' + resp.data.message);
           //afficher la notification de upload
           $scope.hasNotif = true;
           //apres 2 seconds close la notification et rediger au page index
           $timeout(function() {
             $scope.hasNotif = false;
             $location.path('/');
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

       $scope.deleteUploadFile = function (index) {
         $scope.tracks.splice(index,1);
         $scope.trackFiles.splice(index,1);
       };


     }
 ])
   .directive("fileread", [function () {
     return {
       scope: {
         fileread: "="
       },
       link: function (scope, element, attributes) {
         element.bind("change", function (changeEvent) {
           scope.$apply(function () {
             //scope.fileread = changeEvent.target.files[0];
             // or all selected files:
              scope.fileread = changeEvent.target.files;
           });
         });
       }
     }
   }]);
