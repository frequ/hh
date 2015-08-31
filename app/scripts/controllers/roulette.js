'use strict';

angular.module('hhApp')
  .controller('RouletteCtrl', function ($http, $log, $scope, $interval, $timeout, modalProvider, $window) {

    (function(){
        var promise = $scope.req =  $http.get('json/roulette.json');
        promise
            .success(function(data){
                $scope.constructRoulette(data);
                $scope.data = data;
            })
            .error(function(){
                $log.warn('error fetching roulette data');
            });
    })();

    $scope.constructRoulette = function(data){

        var SLOT_HEIGTH = 110;
        var START_OFFSET = -(9*110);
        var START_SLOT_SPEED = 13;
        var START_SLOWING_AFTER = 7000;
        var RANDOM_ITEMS_AMOUNT = 9;
        var REPEAT_RANDOMS = 4;

        // Needed for CSS translates
        var vendor =
    	    (/webkit/i).test(navigator.appVersion) ? '-webkit' :
        	(/firefox/i).test(navigator.userAgent) ? '-moz' :
    	    (/msie/i).test(navigator.userAgent) ? 'ms' :
        	'opera' in window ? '-o' : '';

        $scope.cssTransform = vendor + '-transform';

        var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()); // jshint ignore:line
        $scope.trnOpen = 'translate' + (has3d ? '3d(' : '(');
        $scope.trnClose = has3d ? ',0)' : ')';


        function fitToContainer(canvas){
            canvas.style.width = '100%';
            canvas.width = canvas.offsetWidth;
        }

        function getRandomEvents(){
            var items = [];
            var randomsArray = [];
            var i;

            while (randomsArray.length < RANDOM_ITEMS_AMOUNT) {
                var random = Math.floor(Math.random()*data.length);
                var found = false;

                for (i = 0; i < randomsArray.length; i++) {
                    if (randomsArray[i] === random) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    randomsArray[randomsArray.length] = random;
                }
            }

            angular.forEach(randomsArray, function(randomIndex){
                items.push(data[randomIndex]);
            });

            //repeat items to end of roulette array
            for (i = 0; i < REPEAT_RANDOMS; i++) {
                items.push(items[i]);
            }

            return items;
        }

        function fillCanvas(items, canvas){
            var ctx = canvas.getContext('2d');
            var fullWidth = canvas.width;

            for (var i = 0; i < items.length; i++) {
                ctx.beginPath();
                ctx.rect(20, i*SLOT_HEIGTH, fullWidth-40, 110);
                ctx.fillStyle = "#ddd";
                ctx.fill();

                ctx.lineWidth = 2;
                ctx.strokeStyle = "#d2ac2b";
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "#000";
                ctx.fillText(items[i].name, fullWidth/2, i*SLOT_HEIGTH-40);
                ctx.closePath();
            }

            $scope.offset = START_OFFSET;
            $('#canvas').css($scope.cssTransform, $scope.trnOpen + '0px, ' + $scope.offset + 'px' + $scope.trnClose);

        }

        var canvas = document.getElementById('canvas');
        fitToContainer(canvas);

        var items = getRandomEvents();
        fillCanvas(items, canvas);



        $scope.loop = function(){
            $scope.slotspeed = START_SLOT_SPEED;

            $scope.gameLoop = $interval(draw, 20);

            $scope.slowTimer = $timeout(function(){
                $scope.slowInterval = $interval(function(){
                    if ($scope.slotspeed > 1) {
                        $scope.slotspeed--;
                    }
                }, 500);
            }, START_SLOWING_AFTER);

        };

        function draw(){
            var runner = $('#canvas');
            $scope.offset = $scope.offset + $scope.slotspeed;

            if ($scope.offset >= 0 ) {
                $scope.offset = -980;
            }

            if ($scope.slotspeed === 1) {
                var stopPos = Math.round($scope.offset / SLOT_HEIGTH) * SLOT_HEIGTH;

                if ($scope.offset === stopPos) {
                    $scope.slotpeed = 0;
                    stopAll();

                    var winPos = (Math.abs($scope.offset) / SLOT_HEIGTH)+2;

                    var winEvent = items[winPos];

                    $('#canvas-reel').addClass('won');

                    $timeout( function() {
                        $scope.openModal(winEvent);
                    }, 4000 );
                }
            }

            $(runner).css($scope.cssTransform, $scope.trnOpen + '0px, ' + $scope.offset + 'px' + $scope.trnClose);

        }
    };

    function stopAll(){
        $interval.cancel($scope.gameLoop);
        $interval.cancel($scope.slowInterval);
        $timeout.cancel($scope.slowTimer);
    }

    function reset(){
        $timeout(function(){
            $scope.constructRoulette($scope.data);
            $scope.spinDisabled = false;
            $('#canvas-reel').removeClass('won');
        },1000);

    }

    $scope.spin = function(){
        $scope.loop();
    };

    $scope.openModal = function(event){
        modalProvider.openModal(event);
        reset();
    };

    $scope.back = function(){
        stopAll();
        $window.history.back();
    };

  });
