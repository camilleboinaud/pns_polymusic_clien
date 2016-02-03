'use strict';


angular.module('song',[]);

var checkRouting = function ($sessionStorage, $location) {
  if ($sessionStorage.UserSession === undefined) {
    $location.path('/sign-in');
  }
  return false;
};

/**
 * @ngdoc overview
 * @name pnsPolymusicClientApp
 * @description
 * # pnsPolymusicClientApp
 *
 * Main module of the application.
 */
angular
  .module('pnsPolymusicClientApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload',
    'ngStorage',
    'song'
  ])

  .config(function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  })

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve : {
          factory: checkRouting
        }
      })
      .when('/songs/:songId',{
        templateUrl: 'views/song_detail.html',
        controller: 'SongDetailCtrl',
        controllerAs: 'songDetail',
        resolve : {
          factory: checkRouting
        }
      })
      .when('/user/:userId',{
        templateUrl: 'views/user_manage.html',
        controller: 'ManageSongCtrl',
        resolve : {
          factory: checkRouting
        }
      })
      .when('/sign-in', {
        templateUrl: 'views/sign_in.html',
        controller: 'AuthentificationCtrl'
      })
      .when('/sign-up', {
        templateUrl: 'views/sign_up.html',
        controller: 'AuthentificationCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'MusicUploadController',
        controllerAs: 'uploaderCtrl',
        resolve : {
          factory: checkRouting
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/sign-in'
      });
  })

  .constant('SERVER_ADDR', 'http://localhost:3000/');


