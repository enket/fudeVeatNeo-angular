/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('artDetail').component('artDetail', {
    templateUrl: 'angular_components/arts/artDetail/artDetail.template.html',
    controller: ['$scope', '$location', '$log', '$routeParams', 'Alerts', 'Art', 'sharedCanvasObject'
        , function ($scope, $location, $log, $routeParams, Alerts, Art, sharedCanvasObject) {
            $scope.artsData = Art.get({artId: $routeParams.artId}, function (art) {
                $scope.sharedCanvasObject = sharedCanvasObject;
                $scope.sharedCanvasObject.data = art.data;
                $scope.sharedCanvasObject.width = art.width;
                $scope.sharedCanvasObject.height = art.height;
                $location.path('/canvas/drawing/' + $routeParams.artId);
            });
        }]
});