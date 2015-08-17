'use strict';

angular.module('hhApp')
  .controller('RouletteCtrl', function ($http, $log, $scope, $interval, $timeout, modalProvider, $window) {

    (function(){
        var promise = $http.get('json/roulette.json');
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

        //reset
        $scope.items = [];
        $scope.spinnerPos = 0;
        $scope.spinnerSpeed = 15; //fps
        $scope.spinnerPosVariation = 10;
        $scope.spinnerSlowingIndex = 0;
        $scope.spinnerPositiveDirection = false;

        var items = [];
        var randomIndexesAmount = 8;
        var repeatItemsToEnd = 8;
        var randomsArray = [];
        var i;

        while (randomsArray.length < randomIndexesAmount) {
            var random = Math.floor(Math.random()*data.length);
            var found = false;

            for(i = 0; i < randomsArray.length; i++){
                if(randomsArray[i] === random){
                    found = true;
                    break;
                }
            }

            if(!found) {
                randomsArray[randomsArray.length] = random;
            }
        }

        angular.forEach(randomsArray, function(randomIndex){
            items.push(data[randomIndex]);
        });

        //repeat items to end of roulette array
        for(i = 0; i < repeatItemsToEnd; i++){
            items.push(items[i]);
        }

        $scope.items = items;
        //$log.log('roulette items', $scope.items);

    };


    function updateSpinnerPosition() {
        $scope.spinnerPos += $scope.spinnerPosVariation;
        $('.spinner').css('transform', 'translate(0px, ' + $scope.spinnerPos + 'px)');

        if ($scope.spinnerPos >= 800) {
            // $interval.cancel($scope.spinner);
            $scope.spinnerPos = 180;
        }
    }

    function spinnerMove() {

        $scope.spinner = $interval(updateSpinnerPosition, $scope.spinnerSpeed);
        $scope.slowTimeout = $timeout( startSlowing, 6000);

    }

    function startSlowing() {
        $scope.slower = $interval(slowdownSpinner, 200);
    }

    function slowdownSpinner(){

        var changeDirectionArr = [-4, 2, -1, 0];

        if ($scope.spinnerPosVariation === changeDirectionArr[$scope.spinnerSlowingIndex]) {
            $scope.spinnerPositiveDirection = !$scope.spinnerPositiveDirection;
            $scope.spinnerSlowingIndex++;
        }

        if ($scope.spinnerPosVariation === 0 && $scope.spinnerSlowingIndex > 3) {
            $timeout.cancel($scope.slowTimeout);
            $interval.cancel($scope.spinner);
            $interval.cancel($scope.slower);

            var btnH = $('#reel button').outerHeight(true);
            //var spinnerH = btnH*16;

            var c = (Math.round( Math.floor($scope.spinnerPos)/ btnH )* btnH)-5;

            // the spinner goes c overflow + 4 buttons, so index is as follows
            var index = Math.round((c+4*btnH) / btnH);

            (function adjustPos(){

                if($scope.spinnerPos > c){
                    $scope.spinnerPos--;
                }else{
                    $scope.spinnerPos++;
                }

                $('.spinner').css('transform', 'translate(0px, ' + $scope.spinnerPos + 'px)');

                if ($scope.spinnerPos !== c) {
                    $timeout(adjustPos, 40);
                }

            })();

            $scope.winner = index;

            $('.spinner button:nth-child('+ $scope.winner +')').addClass('btn-win');

            $timeout( function() {
                    $scope.openModal($scope.items[$scope.winner-1]);
                }, 3000 );
        }

        if ($scope.spinnerPositiveDirection) {
            $scope.spinnerPosVariation++;
        }else{
            $scope.spinnerPosVariation--;
        }

    }

    function resetRoulette() {
        //wait that the modal is open so doesnt look funny
        $log.log('resetting roulette ..');
        $timeout(function(){
            $scope.constructRoulette($scope.data);
            $('.spinner button:nth-child('+ $scope.winner +')').removeClass('btn-win');
            $('.spinner').css('transform', 'translate(0px, ' + $scope.spinnerPos + 'px)');
            $scope.spinDisabled = false;
        },1000);

    }

    $scope.spin = function(){
        spinnerMove();
    };

    $scope.openModal = function(event){
        modalProvider.openModal(event);
        resetRoulette();
    };

    $scope.back = function(){
        $window.history.back();
    };

  });
