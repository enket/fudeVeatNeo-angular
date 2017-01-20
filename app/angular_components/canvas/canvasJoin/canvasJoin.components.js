/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasJoin').component('canvasJoin', {
    templateUrl: 'angular_components/canvas/canvasJoin/canvasJoin.template.html',
    controller: ['CurrentLocationStr', function (CurrentLocationStr) {
        this.$onInit = function () {
            CurrentLocationStr.title = 'Join';
        }
    }]
});