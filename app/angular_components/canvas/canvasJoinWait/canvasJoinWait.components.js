/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasJoinWait').component('canvasJoinWait', {
    templateUrl: 'angular_components/canvas/canvasJoinWait/canvasJoinWait.template.html',
    controller: ['$routeParams', '$scope', '$location', '$log', 'Canvas', 'socket', 'Alerts', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($routeParams, $scope, $location, $log, Canvas, socket, Alerts, CurrentLocationStr, sharedCanvasObject) {
            $scope.canvasId = $routeParams.sessionId;

            socket.on('continueToCanvas', function () {
                $location.path('/canvas/drawing/' + $scope.sharedCanvasObject.uuid);
            });

            $scope.canvasData = Canvas.get({canvasId: $scope.canvasId}, function (canvas) {
                $scope.sharedCanvasObject = sharedCanvasObject;
                $scope.sharedCanvasObject.title = canvas.title;
                $scope.sharedCanvasObject.description = canvas.description;
                $scope.sharedCanvasObject.height = canvas.height;
                $scope.sharedCanvasObject.width = canvas.width;
                $scope.sharedCanvasObject.uuid = canvas.uuid;
                $log.info($scope.sharedCanvasObject);
                socket.emit('joinRoom', {value: $scope.sharedCanvasObject.uuid});
            });

        }]
});