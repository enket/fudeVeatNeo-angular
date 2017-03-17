/**
 * Created by trnay on 2017/03/02.
 */
'use strict';

angular.module('mainFrame').component('mainFrame', {
    templateUrl: 'angular_components/mainFrame/mainFrame.template.html',
    controller: ['$scope', '$mdSidenav', '$mdMenu', '$mdDialog', '$mdToast', 'mainFrameObject', 'socket', 'sharedCanvasObject',
        function ($scope, $mdSilenav, $mdMenu, $mdDialog, $mdToast, mainFrameObject, socket, sharedCanvasObject) {
        $scope.mainFrameObject = mainFrameObject;
        $scope.sharedCanvasObject = sharedCanvasObject;

        $scope.toggleSidenav = function () {
            $mdSilenav('left').toggle();
        };

        $scope.openMenu = function (ev) {
            $mdMenu.open(ev);
        };

        $scope.saveArt = function (ev) {
            $mdDialog.show(
                $mdDialog.confirm()
                    .title('作品の保存')
                    .textContent('説明')
                    .ok('保存')
                    .cancel('キャンセル')
                    .targetEvent(ev)
            ).then(function () {
                $('.canvas-main').get(0).toBlob(function (blob) {
                    // socket.emit('saveArt', $scope.sharedCanvasObject, blob);
                    socket.emit('saveArt', $scope.sharedCanvasObject, "");
                });
            }, function () {
                $('.canvas-main').get(0).toBlob(function (blob) {
                    var a = document.createElement('a');
                    a.target = '_blank';
                    a.href = window.webkitURL.createObjectURL(blob);
                    a.click();
                });
            });
        };

        $scope.nothingHappens = function (ev) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('まだ実装されてないよ。残念！')
                    .position('bottom right')
            );
        };

        $scope.toggleFullScreen = function () {
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
        };
    }]
});