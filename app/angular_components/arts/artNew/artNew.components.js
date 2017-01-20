/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('artNew').component('artNew', {
    templateUrl: 'angular_components/arts/artNew/artNew.template.html',
    controller: ['$routeParams', function ($routeParams) {
        this.artId = $routeParams.artId;
    }]
});