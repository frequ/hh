'use strict';

angular.module('hhApp')
.controller('EventModalCtrl', function ($scope, $modalInstance, items, $sce, $window, $rootScope) {

    $scope.event = items;
    $scope.ytUrl = null;
    $scope.imagePath = 'img';
    $scope.buttonStyle = "btn btn-default"

    if ($scope.event.videoId) {
        var protocol = location.protocol;
        $scope.ytUrl = $sce.trustAsResourceUrl(protocol+"//www.youtube.com/embed/"+ $scope.event.videoId +"?rel=0");
    }

    // store modalInstance here for router
    $rootScope.modalInstance = $modalInstance;

    $scope.ok = function () {
        $modalInstance.dismiss('close');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openUrl = function () {
      if ($scope.event.openUrl) {
        var win = $window.open($scope.event.openUrl, '_blank');
  			win.focus();
      }

    };

});
