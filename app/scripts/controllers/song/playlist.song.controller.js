/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('song').controller('PlaylistController', ['$scope', '$state', '$http', 'Music',
    function ($scope, $state, $http, Authentication, Music) {

        $scope.playlist = [
            {
                name:'Hello',
                cover:'default.jpg',
                url:'modules/music/music/Adele-Hello.mp3',
                time:{
                    min:'03',
                    sec:'00'
                },
                isPlaying: false
            },
            {
                name:'Read All About It, Pt. III',
                cover:'default.jpg',
                url:'modules/music/music/Emeli Sandé - Read All About It, Pt. III.mp3',
                time:{
                    min:'04',
                    sec:'00'
                },
                isPlaying: false
            },
            {
                name:'On Our Way',
                cover:'default.jpg',
                url:'modules/music/music/The Royal Concept - On Our Way.mp3',
                time:{
                    min:'05',
                    sec:'00'
                },
                isPlaying: false
            }
        ];
        $scope.lastIndex = 0;

        /**
         * get playlist from server
         */
        function getPlaylist(){
            console.log('get playlist');
            $http.get('/api/music/playlist')
                .then(
                function(response){
                    $scope.playlist = response.data;
                }, function(error){
                    console.log(error);
                });
        }
        getPlaylist();

        $scope.playMusic = function playMusic(index,barIndex){
            console.log('click index = '+index+' barIndex = '+ barIndex);
            if(!$scope.playlist[index].isPlaying) {
                Music.updatePlayingMusicAt(barIndex, $scope.playlist[index], function () {
                    $scope.playlist[$scope.lastIndex].isPlaying = false;
                    $scope.playlist[index].isPlaying = true;
                    $scope.lastIndex = index;
                    //Music.getPlayingMusicAt(0).load();
                });
                console.log('Music playing = '+Music.getPlayingMusicAt(0).name);
            }

        };
    }
]);
