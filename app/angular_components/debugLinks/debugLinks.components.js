/**
 * Created by trnay on 2017/01/15.
 */
'use strict';

angular.module('debugLinks').component('debugLinks', {
    templateUrl: 'angular_components/debugLinks/debugLinks.template.html',
    controller: ['CurrentLocationStr', function (CurrentLocationStr) {
        this.$onInit = function () {
            CurrentLocationStr.title = 'Debug Links';
        }
    }]
});