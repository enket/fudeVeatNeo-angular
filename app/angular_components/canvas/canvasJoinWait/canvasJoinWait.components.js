/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasJoinWait').component('canvasJoinWait', {
    templateUrl: 'angular_components/canvas/canvasJoinWait/canvasJoinWait.template.html',
    controller: ['$routeParams', '$scope', '$location', 'socket', 'Alerts', 'CurrentLocationStr'
        , function ($routeParams, $scope, $location, socket, Alerts, CurrentLocationStr) {
            this.artId = $routeParams.sessionId;

            socket.on('continueToCanvas', function () {
                $location.path('/canvas/drawing/' + $routeParams.sessionId);
            });

            this.$onInit = function () {
                Alerts.push({
                    type: 'alert-info',
                    strong: 'canvas/join/:sessionId',
                    text: ' current sessionId is ' + $routeParams.sessionId
                });

                CurrentLocationStr.title = 'Waiting to Join';

                socket.emit('joinRoom', {value: $routeParams.sessionId});
            }
        }]
});