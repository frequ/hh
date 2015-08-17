'use strict';

angular.module('hhApp')
.controller('EventModalCtrl', function ($scope, $modalInstance, items, $sce) {

    $scope.event = items;

    if ($scope.event.content && typeof $scope.event.content === "string") {
        $scope.event.content = $sce.trustAsHtml($scope.event.content);
    }

    if($scope.event.videoId){
        var protocol = location.protocol;
        $scope.ytUrl = $sce.trustAsResourceUrl(protocol+"//www.youtube.com/embed/"+ $scope.event.videoId +"?rel=0");
    }

    $scope.ok = function () {
        $modalInstance.dismiss('close');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
