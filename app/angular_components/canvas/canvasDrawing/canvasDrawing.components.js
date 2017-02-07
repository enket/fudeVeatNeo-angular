/**
 * Created by trnay on 2017/01/12.
 */
'use strict';

angular.module('canvasDrawing').component('canvasDrawing', {
    templateUrl: 'angular_components/canvas/canvasDrawing/canvasDrawing.template.html',
    controller: ['$routeParams', '$document', '$log', '$scope', 'socket', 'uuid2', 'Alerts', 'sharedCanvasObject'
        , function ($routeParams, $document, $log, $scope, socket, uuid2, Alerts, sharedCanvasObject) {
            $scope.CANVAS_STD_WIDTH = 1500;
            $scope.CANVAS_STD_HEIGHT = 1000;
            $scope.CANVAS_STD_GLOBALALPHA = 0.5;
            $scope.SCROLL_COUNT = 6;
            $scope.OLD_FACT = 0.6;
            $scope.NEW_FACT = 0.4;
            $scope.brushImg = new Image();
            $scope.brushImg.src = 'assets/img/brush.png';
            $scope.brushImgGray = new Image();
            $scope.brushImgGray.src = 'assets/img/brush_gray186.png';



            this.$onInit = function () {
                Alerts.push({
                    type: 'alert-info',
                    strong: 'canvas/:sessionId',
                    text: ' current sessionId is ' + $routeParams.sessionId + ' ' + new Date()
                });



                $scope.setParameters();
                $scope.canvasOverlay = $scope.makeCanvas("canvas-overlay");
                $scope.canvasMain = $scope.makeCanvas("canvas-main");
                $scope.canvasMainCtx = $scope.canvasMain[0].getContext('2d');
                $scope.canvasBg = $scope.makeCanvas("canvas-background");
                $scope.canvasBgCtx = $scope.canvasBg[0].getContext('2d');
                $scope.addTouchEvent($scope.canvasOverlay);
                $scope.addMouseEvent($scope.canvasOverlay);

                $scope.sharedCanvasObject = sharedCanvasObject;
                if ($scope.sharedCanvasObject.data.length) {
                    for (var i = 0; i < $scope.sharedCanvasObject.data.length; i++) {
                        var tempDataPrev = {};
                        var tempDataCurrent = {};
                        for (var j = 0; j < $scope.sharedCanvasObject.data[i].data.length; j++) {
                            tempDataPrev = tempDataPrev || $scope.sharedCanvasObject.data[i].data[j];
                            tempDataCurrent = $scope.sharedCanvasObject.data[i].data[j];
                            setTimeout(function (prev, current) {
                                $scope.drawBrushUnderlay(prev, current);
                            }, 10, tempDataPrev, tempDataCurrent);
                            tempDataPrev = $scope.sharedCanvasObject.data[i].data[j];
                        }
                    }
                }
            };

            this.$onDestroy = function () {
                socket.destroy();
            };

            $scope.setParameters = function () {
                $scope.canvasRatio = $scope.CANVAS_STD_WIDTH / $scope.CANVAS_STD_HEIGHT;
                $scope.startCanvasId = angular.element(document.querySelector('#startCanvas'));
                $scope.devicePixelRatio = window.devicePixelRatio;
                $scope.screenHeight = window.parent.screen.height;
                $scope.canvasWidth = $scope.screenHeight * $scope.canvasRatio;
                $scope.canvasHeight = $scope.screenHeight;
            };

            $scope.makeCanvas = function (name) {
                // 新規canvasエレメント
                var newElement = angular.element(document.createElement("canvas"));
                newElement.attr('class', name);
                newElement.attr('width', $scope.canvasWidth * $scope.devicePixelRatio);
                newElement.attr('height', $scope.canvasHeight * $scope.devicePixelRatio);
                newElement.css('width', $scope.canvasWidth + "px");
                newElement.css('height', $scope.canvasHeight + "px");

                // ctx設定
                var newCtx = newElement[0].getContext('2d');
                newCtx.globalAlpha = $scope.CANVAS_STD_GLOBALALPHA;
                newCtx.globalCompositeOperation = "source-over";
                newCtx.scale($scope.devicePixelRatio, $scope.devicePixelRatio);

                // bodyに挿入
                newElement.insertAfter($scope.startCanvasId);

                return newElement;
            };

            $scope.addTouchEvent = function (canvas) {
                var isScrolling = false;
                var moveCount = 0;
                var pointStack = [];
                var userId = uuid2.newuuid();

                // タッチ開始
                canvas.on('touchstart', function () {
                    if (event.targetTouches.length == 1) {
                        $log.info("touchstart with 1 finger");
                        $scope.pushPoint(pointStack, event.targetTouches[0], true);
                        socket.emit('drawInRoom', {
                            data: [pointStack[pointStack.length - 2], pointStack[pointStack.length - 1]],
                            userId: userId
                        });
                    } else if (event.targetTouches.length == 2) {
                        $log.info("touchstart with 2 fingers");
                    }
                    $log.debug(event);
                });

                // タッチ移動
                canvas.on('touchmove', function () {
                    moveCount++;
                    if (event.targetTouches.length == 1 && !isScrolling) {
                        $log.info("drowing");
                        $scope.pushPoint(pointStack, event.targetTouches[0], false);
                        $scope.drawBrush(pointStack[pointStack.length - 2], pointStack[pointStack.length - 1]);
                        socket.emit('drawInRoom', {
                            data: [pointStack[pointStack.length - 2], pointStack[pointStack.length - 1]],
                            userId: userId
                        });
                        // このイベントによるデフォルトのスクロールを無効化
                        event.preventDefault();
                    } else if (event.targetTouches.length == 2 && moveCount <= $scope.SCROLL_COUNT) {
                        isScrolling = true;
                    } else if (event.targetTouches.length == 2 && isScrolling) {
                        $log.info("scrolling");
                    } else {
                        // このイベントによるデフォルトのスクロールを無効化
                        event.preventDefault();
                    }
                    $log.debug(event);
                });

                // タッチ終了
                canvas.on('touchend', function () {
                    if (event.targetTouches.length == 0) {
                        $log.info("touchend");
                        moveCount = 0;
                        if (isScrolling) {
                            isScrolling = false;
                            $log.info("end scrolling");
                        }
                    }
                    $log.debug(event);
                });
            };

            $scope.addMouseEvent = function (canvas) {
                canvas.on('mousedown', function () {
                    $log.info("mousedown");
                });
                canvas.on('mouseup', function () {
                    $log.info("mouseup");
                });
            };

            $scope.pushPoint = function (array, touch, isFirst) {
                var x, y, rad, dist, angle, deltaRad;
                var prevData, newData;

                var newFact = $scope.NEW_FACT;
                var oldFact = $scope.OLD_FACT;

                var offsetX = touch.target.offsetParent.scrollLeft;
                var offsetY = touch.target.offsetParent.scrollTop;

                if (isFirst) {
                    array.push({
                        x: undefined,
                        y: undefined,
                        rad: undefined,
                        deltaRad: undefined,
                        dist: undefined,
                        angle: undefined
                    });
                    x = touch.pageX + offsetX;
                    y = touch.pageY + offsetY;
                    rad = touch.radiusX;
                    deltaRad = undefined;
                    dist = undefined;
                    angle = undefined;
                } else {
                    prevData = array[array.length - 1];
                    x = (touch.pageX + offsetX) * newFact + prevData.x * oldFact;
                    y = (touch.pageY + offsetY) * newFact + prevData.y * oldFact;
                    rad = touch.radiusX * newFact + prevData.rad * oldFact;
                    dist = Math.hypot(x - prevData.x, y - prevData.y);
                    deltaRad = (rad - prevData.rad) / dist;
                    angle = Math.atan2(x - prevData.x, y - prevData.y);
                }

                newData = {
                    x: x,
                    y: y,
                    rad: rad,
                    dist: dist,
                    angle: angle,
                    deltaRad: deltaRad
                };

                array.push(newData);

                return newData;
            };

            $scope.drawBrush = function (prev, current) {
                if (prev.x == undefined) {
                    return;
                }
                var OFFSET_SIZE = 27;
                var COEF_SIZE = 1.56;

                var x = prev.x;
                var y = prev.y;
                var size = prev.rad * COEF_SIZE;
                var angleSin = Math.sin(current.angle);
                var angleCos = Math.cos(current.angle);
                var delta;
                var i = 0;

                while (i < current.dist) {
                    size = size + current.deltaRad * COEF_SIZE;
                    if (size < 2) {
                        size = 2;
                    }
                    delta = (45 - size - OFFSET_SIZE) / 2;
                    x = x + angleSin;
                    y = y + angleCos;
                    $scope.canvasMainCtx.drawImage($scope.brushImg, x + delta, y + delta, size - OFFSET_SIZE, size - OFFSET_SIZE);
                    i = (i + 1) | 0;
                }
            };

            $scope.drawBrushUnderlay = function (prev, current) {
                $log.info(prev);
                if (prev.x == undefined) {
                    return;
                }
                var OFFSET_SIZE = 27;
                var COEF_SIZE = 1.56;

                var x = prev.x;
                var y = prev.y;
                var size = prev.rad * COEF_SIZE;
                var angleSin = Math.sin(current.angle);
                var angleCos = Math.cos(current.angle);
                var delta;
                var i = 0;

                while (i < current.dist) {
                    size = size + current.deltaRad * COEF_SIZE;
                    if (size < 2) {
                        size = 2;
                    }
                    delta = (45 - size - OFFSET_SIZE) / 2;
                    x = x + angleSin;
                    y = y + angleCos;
                    $scope.canvasBgCtx.drawImage($scope.brushImgGray, x + delta, y + delta, size - OFFSET_SIZE, size - OFFSET_SIZE);
                    i = (i + 1) | 0;
                }
            };


            socket.on('drawInRoom', function (data) {
                $scope.drawBrush(data.data[0], data.data[1]);
            });

            socket.on('commitData', function () {
                socket.emit('commitData');
            });

            socket.on('saved', function () {
                Alerts.push({
                    type: 'alert-info',
                    strong: '',
                    text: 'This canvas has saved successfully ' + new Date()
                });
            })
        }]
});