/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('artDetail').component('artDetail', {
    templateUrl: 'angular_components/arts/artDetail/artDetail.template.html',
    controller: ['$scope', '$location', '$log', '$routeParams', 'Alerts', 'Art', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($scope, $location, $log, $routeParams, Alerts, Art, CurrentLocationStr, sharedCanvasObject) {
            $scope.artsData = Art.get({artId: $routeParams.artId}, function (art) {
                $scope.sharedCanvasObject = sharedCanvasObject;
                $scope.sharedCanvasObject.data = art.data;
                $location.path('/canvas/drawing/' + $routeParams.artId);
            });

            this.$onInit = function () {
                Alerts.push({
                    type: 'alert-info',
                    strong: 'arts/:artId',
                    text: ' current artId is ' + $routeParams.artId
                });

                CurrentLocationStr.title = 'Art Detail';
            }
        }]
});