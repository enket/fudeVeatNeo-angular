/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('core.art').factory('Art', ['$resource',
    function ($resource) {
        return $resource('api/arts/:artId', {}, {
            query: {
                method: 'GET',
                params: {artId: ''},
                isArray: true
            }
        })
    }]);