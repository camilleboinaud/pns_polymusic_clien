'use strict';

angular.module('pnsPolymusicClientApp').factory('User', ['$http', 'SERVER_ADDR', '$sessionStorage',
  function ($http, SERVER_ADDR, $sessionStorage) {
    var User= {};
    var loggedInUser = null;

    User.register = function (user, callback) {
      $http({
        method: 'POST',
        url: SERVER_ADDR + 'register',
        data: {
          username: user.username,
          email: user.email,
          password: user.password
        }
      })
      .then(function success(msg){
          connect(msg.data.user);
        }, function error(msg) {
          callback(msg.data);
        }
      );
    };

    User.login = function(user, callback){
      $http({
        method: 'POST',
        url: SERVER_ADDR + 'login',
        data: {
          email: user.email,
          password: user.password
        }
      })
      .then(function success(msg){
          connect(msg.data.user);
          callback(msg.data.user);
        }, function error(msg) {
          callback(msg.data);
        }
      );
    }

    User.logout = function(callback){
      $http({
        method: 'POST',
        url: SERVER_ADDR + 'logout',
        data: {}
      })
      .then(function success(msg){
            disconnect();
            callback(msg.data)
          }, function error(msg) {
            callback(msg.data);
          }
        );
    }

    User.isLoggedIn = function(){
      return ($sessionStorage.UserSession !== undefined);
    }

    var connect = function(user){
      $sessionStorage.UserSession = {
        username: user.username,
        email: user.email,
        id: user._id
      };
    };

    var disconnect = function() {
      delete $sessionStorage.UserSession;
    };

    var getCurrentUser = function(){
      return ($sessionStorage.UserSession) ? $sessionStorage.UserSession : null;
    }

    return User;
  }
]);
