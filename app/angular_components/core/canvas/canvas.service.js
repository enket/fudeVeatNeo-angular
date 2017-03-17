/**
 * Created by trnay on 2017/03/04.
 */
'use strict';

angular.module('core.canvas').factory('Canvas', ['$resource',
    function ($resource) {
        return $resource('api/canvases/:canvasId', {}, {
            query: {
                method: 'GET',
                params: {canvasId: ''},
                isArray: true
            }
        })
    }]);