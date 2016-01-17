 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('song').controller('MusicUploadController', ['$scope', '$timeout', '$window', 'Upload',
     function ($scope, $timeout, $window, Upload) {

       $scope.musicName = '';

       $scope.submit = function() {
         if ($scope.file) {
           $scope.upload($scope.file);
         }
       };

       // upload on file select or drop
       $scope.upload = function (file) {
         Upload.upload({
           url: 'http://localhost:3000/api/song',
           data: {file: file, 'username': $scope.username}
         }).then(function (resp) {
           console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
         }, function (resp) {
           console.log('Error status: ' + resp.status);
         }, function (evt) {
           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         });
       };

       // Create file uploader instance
       //$scope.uploader = Upload.upload({
       //  url: 'http://localhost:3000/api/song'
       //});


       //// Set file uploader music filter
       //$scope.uploader.filters.push({
       //  name: 'soundFilter',
       //  fn: function (item) {
       //    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
       //    return '|mp3|'.indexOf(type) !== -1;
       //  }
       //});

       // Called after the user selected a new sound file
     //  $scope.uploader.onAfterAddingFile = function (fileItem) {
     //    if ($window.FileReader) {
     //      var fileReader = new FileReader();
     //      fileReader.readAsDataURL(fileItem._file);
     //
     //      // get music's name
     //      $scope.musicName = fileItem._file.name;
     //
     //      fileReader.onload = function () { //fileReaderEvent
     //        $timeout(function () {
     //          //$scope.musicURL = fileReaderEvent.target.result;
     //        }, 0);
     //      };
     //    }
     //  };
     //
     //  // Called after the user has successfully uploaded a new music
     //  $scope.uploader.onSuccessItem = function () { //fileItem, response, status, headers
     //    // Show success message
     //    $scope.success = true;
     //
     //    // Populate user object
     //    //$scope.user = Authentication.user = response;
     //
     //    // Clear upload buttons
     //    $scope.cancelUpload();
     //  };
     //
     //  // Called after the user has failed to uploaded a new music
     //  $scope.uploader.onErrorItem = function (fileItem, response) {
     //    // Clear upload buttons
     //    $scope.cancelUpload();
     //
     //    // Show error message
     //    $scope.error = response.message;
     //  };
     //
     //  // Upload music
     //  $scope.uploadMusic = function () {
     //    // Clear messages
     //    $scope.success = $scope.error = null;
     //
     //    // Start upload
     //    $scope.uploader.uploadAll();
     //  };
     //
     //  // Cancel the upload process
     //  $scope.cancelUpload = function () {
     //    $scope.uploader.clearQueue();
     //
     //    // clean fields
     //    $scope.musicName = '';
     //  };
     }
 ]);
