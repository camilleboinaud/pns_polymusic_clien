'use strict';


angular.module('song',[]);

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
    'song'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/sign-in', {
        templateUrl: 'views/sign_in.html',
        controller: 'AuthentificationCtrl',
        controllerAs: 'auth'
      })
      .when('/sign-up', {
        templateUrl: 'views/sign_up.html',
        controller: 'AuthentificationCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'MusicUploadController',
        controllerAs: 'uploaderCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


