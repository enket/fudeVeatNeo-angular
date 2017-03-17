/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('artList').component('artList', {
    templateUrl: 'angular_components/arts/artList/artList.template.html',
    controller: ['$scope', '$log', '$window', 'Alerts', 'Art', 'CurrentLocationStr', function ($scope, $log, $window, Alerts, Art, CurrentLocationStr) {
        $scope.arts = Art.query();
        $log.info($scope.arts);

        this.$onInit = function () {
            CurrentLocationStr.title = 'Art List';
        };

        $scope.changePage = function (url) {
            $log.info(url);
            $window.location.href = '#!/arts/' + url;
        }
    }]
});