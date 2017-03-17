/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasNewWait').component('canvasNewWait', {
    templateUrl: 'angular_components/canvas/canvasNewWait/canvasNewWait.template.html',
    controller: ['$routeParams', '$scope', '$location', '$log', '$timeout', 'socket', 'Alerts', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($routeParams, $scope, $location, $log, $timeout, socket, Alerts, CurrentLocationStr, sharedCanvasObject) {
            $scope.leave = true;
            socket.on('continueToCanvas', function () {
                $scope.leave = false;
                $timeout(function () {
                    $location.path('/canvas/drawing/' + $scope.sharedCanvasObject.uuid)
                }, 0);
            });

            $scope.sharedCanvasObject = sharedCanvasObject;

            this.$onDestroy = function () {
                $log.info("onDestroy canvasNewWait");
                if ($scope.leave) {
                    socket.emit('leaveRoom');
                }
                socket.emit('removeRoom');
            };

            $scope.continueToCanvas = function () {
                socket.emit('continueToCanvas')
            }
        }]
});