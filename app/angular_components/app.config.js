/**
 * Created by trnay on 2017/01/10.
 */
'use strict';

angular.module('fudeVeatNeoApp').config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            template: '<home-selector></home-selector>'
        }).when('/canvas/drawing/:sessionId', {
            template: '<canvas-drawing></canvas-drawing>'
        }).when('/canvas/new', {
            template: '<canvas-new></canvas-new>',
            activetab: 'new'
        }).when('/canvas/new/:sessionId', {
            template: '<canvas-new-wait></canvas-new-wait>'
        }).when('/canvas/join', {
            template: '<canvas-new></canvas-new>',
            activetab: 'join'
        }).when('/canvas/join/:sessionId', {
            template: '<canvas-join-wait></canvas-join-wait>'
        }).when('/arts', {
            template: '<art-list></art-list>'
        }).when('/arts/:artId', {
            template: '<art-detail></art-detail>'
        }).when('/arts/:artId/new', {
            template: '<art-new></art-new>'
        }).when('/debug-links', {
            template: '<debug-links></debug-links>'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);
