/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasNew').component('canvasNew', {
    templateUrl: 'angular_components/canvas/canvasNew/canvasNew.template.html',
    controller: ['$scope', '$rootScope', '$route', '$location', '$log', 'Canvas', 'socket', 'uuid2', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($scope, $rootScope, $route, $location, $log, Canvas, socket, uuid2, CurrentLocationStr, sharedCanvasObject) {

            $scope.sharedCanvasObject = sharedCanvasObject;
            $scope.sharedCanvasObject.height = window.parent.screen.height;
            $scope.sharedCanvasObject.uuid = uuid2.newuuid();

            $scope.ratio = 1;
            $scope.ratios = [
                {width: 1, height: 1},
                {width: 4, height: 3},
                {width: 3, height: 2},
                {width: 16, height: 9}
            ];

            $scope.expand = 1;
            $scope.expands = [1, 1.5, 2, 3, 4];

            this.$onInit = function () {
                socket.connect();
            };

            $scope.calcCanvasWidth = function () {
                $scope.sharedCanvasObject.height = window.parent.screen.height * $scope.expand;
                $scope.sharedCanvasObject.width = parseInt($scope.sharedCanvasObject.height * $scope.ratio);
                return $scope.sharedCanvasObject.width;
            };

            $scope.createRoom = function () {
                socket.emit('createRoom', {value: $scope.sharedCanvasObject});
            };

            $scope.reloadCanvases = function () {
                $scope.canvases = Canvas.query();
                $log.info($scope.canvases);
            };
        }]
});