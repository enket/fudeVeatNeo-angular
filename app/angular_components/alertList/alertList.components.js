/**
 * Created by trnay on 2017/01/15.
 */
'use strict';

angular.module('alertList').component('alertList', {
    templateUrl: 'angular_components/alertList/alertList.template.html',
    controller: ['Alerts', function (Alerts) {
        this.alerts = Alerts;
    }]
});