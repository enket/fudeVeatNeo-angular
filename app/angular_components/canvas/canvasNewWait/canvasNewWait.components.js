/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasNewWait').component('canvasNewWait', {
    templateUrl: 'angular_components/canvas/canvasNewWait/canvasNewWait.template.html',
    controller: ['$routeParams', '$scope', '$location', 'socket', 'Alerts', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($routeParams, $scope, $location, socket, Alerts, CurrentLocationStr, sharedCanvasObject) {
            $scope.sessionId = $routeParams.sessionId;

            socket.on('continueToCanvas', function () {
                $location.path('/canvas/drawing/' + $scope.sharedCanvasObject.uuid);
            });

            this.$onInit = function () {
                $scope.sharedCanvasObject = sharedCanvasObject;

                Alerts.push({
                    type: 'alert-info',
                    strong: 'canvas/new/:sessionId',
                    text: ' current sessionId is ' + $routeParams.sessionId
                });

                CurrentLocationStr.title = 'Waiting to start';

                socket.emit('joinRoom', {value: $scope.sharedCanvasObject.uuid});
            }
        }]
});