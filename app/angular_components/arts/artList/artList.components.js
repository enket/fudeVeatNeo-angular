/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('artList').component('artList', {
    templateUrl: 'angular_components/arts/artList/artList.template.html',
    controller: ['$scope', 'Alerts', 'Art', 'CurrentLocationStr', function ($scope, Alerts, Art, CurrentLocationStr) {
        $scope.arts = Art.query();

        this.$onInit = function () {
            CurrentLocationStr.title = 'Art List';
        }
    }]
});