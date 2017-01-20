/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasNew').component('canvasNew', {
    templateUrl: 'angular_components/canvas/canvasNew/canvasNew.template.html',
    controller: ['$scope', '$rootScope', '$route', '$location', '$log', 'uuid2', 'CurrentLocationStr', 'sharedCanvasObject'
        , function ($scope, $rootScope, $route, $location, $log, uuid2, CurrentLocationStr, sharedCanvasObject) {
        $scope.$route = $route;
        $scope.qrHref = 'http://zxing.appspot.com/scan?ret=http%3A//' + $location.host() + '%3A' + $location.port() + '/%23%21/canvas/join/%7BCODE%7D';
        // $scope.qrHref = 'http://zxing.appspot.com/scan?ret=http%3A//tes.to/zxing.html%3Fcode%3D%7BCODE%7D';


        this.$onInit = function () {
            CurrentLocationStr.title = $route.current.activetab;
            $scope.sharedCanvasObject = sharedCanvasObject;
            $scope.sharedCanvasObject.uuid = uuid2.newuuid();
        };

        $scope.clickButton = function () {
            $location.path('/canvas/new/' + $scope.sharedCanvasObject.uuid);
        };

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            CurrentLocationStr.title = $route.current.activetab;
        });
    }]
});