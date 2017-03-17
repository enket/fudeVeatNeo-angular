/**
 * Created by trnay on 2017/01/18.
 */
'use strict';

angular.module('sharedCanvas').service('sharedCanvasObject', function () {
    var service = {
        title: '名称未設定のタイトル',
        description: 'この作品にはまだ説明がありません。ｲｪｲ!',
        height: '',
        width: '',
        uuid: '',
        data: []
    };
    return service;
});