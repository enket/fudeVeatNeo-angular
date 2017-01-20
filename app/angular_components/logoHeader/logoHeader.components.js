/**
 * Created by trnay on 2017/01/11.
 */
'use strict';

angular.module('logoHeader').component('logoHeader', {
    templateUrl: 'angular_components/logoHeader/logoHeader.template.html',
    controller: ['$scope', '$location', '$rootScope', '$log', 'socket', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($scope, $location, $rootScope, $log, socket, CurrentLocationStr, sharedCanvasObject) {
            $scope.isTitleScreen = ($location.url() == '/');
            $scope.isCanvas = Boolean($location.url().match(/\u002fcanvas\u002fdrawing\u002f/));

            $scope.sharedCanvasObject = sharedCanvasObject;

            this.currentLocationStr = CurrentLocationStr;

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                var thisLocation = $location.url();
                $scope.isTitleScreen = (thisLocation == '/');
                $scope.isCanvas = Boolean(thisLocation.match(/\u002fcanvas\u002fdrawing/));
            });

            $scope.onClickSave = function () {
                socket.emit('saveArt', {
                    artId: $scope.sharedCanvasObject.uuid,
                    title: $scope.sharedCanvasObject.title,
                    description: $scope.sharedCanvasObject.description
                });
            };

            this.toggleFullScreen = function () {
                if (!document.fullscreenElement &&    // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }
        }]
});