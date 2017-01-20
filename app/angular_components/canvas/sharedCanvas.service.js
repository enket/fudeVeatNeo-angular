/**
 * Created by trnay on 2017/01/18.
 */
'use strict';

angular.module('sharedCanvas').service('sharedCanvasObject', function () {
    var service = {
        title: 'Unnamed title',
        description: 'This is just a new canvas, yay!',
        people: '2',
        uuid: '',
        data: []
    };
    return service;
});