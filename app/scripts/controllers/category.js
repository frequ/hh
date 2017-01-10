'use strict';

angular.module('hhApp')
.controller('CategoryCtrl', function ($scope, $log, $routeParams, modalProvider, $window, $sce, HttpService) {

    $scope.events = [];
    $scope.eventsName = "";
    $scope.eventsLead = "";
    $scope.hasSubcategories = false;
    $scope.inSubcategoryListing = false;
    $scope.categoryId = null;

    var getCategory = function() {
      var categoryId = $routeParams.categoryId;
      $scope.categoryId = categoryId;
      HttpService.GET(categoryId).then(function(data) {
        if (data.subcategories) {
            $scope.subcategories = data.subcategories;
            $scope.hasSubcategories = true;
        }
        // debug opening roulette stuffs in http://localhost:9000/#/category/roulette
        // console.log(data)
        // $scope.openModal(data[15])

        $scope.parentEventsName = $scope.eventsName = data.name;
        $scope.parentEvents = $scope.events = data.events;
        $scope.parentEventsLead = $scope.eventsLead = $sce.trustAsHtml(data.lead);

      });
    };
    getCategory();

    $scope.openModal =  function(event){
        modalProvider.openModal(event);
    };

    $scope.openUrl = function(url){
      if( url && url.length > 0 ) {
  			var win = $window.open(url, '_self');
  			win.focus();
	    }
    };

    $scope.selectSubCategory = function(subcategory){

        $scope.selectedSubCategory = subcategory;
        $scope.inSubcategoryListing = true;

        var events = [];

        angular.forEach($scope.events, function(event){
            if(event.belongsTo === subcategory.name) {
                events.push(event);
            }
        });

        $scope.events = events;
        $scope.eventsName += " - "+subcategory.name;
        $scope.eventsLead = $sce.trustAsHtml(subcategory.lead);
        $scope.hasSubcategories = false;

    };

    $scope.back = function(){

        if ($scope.inSubcategoryListing) {
            $scope.hasSubcategories = true;

            $scope.events = [];
            $scope.events = $scope.parentEvents;
            $scope.eventsLead = $scope.parentEventsLead;
            $scope.eventsName = $scope.parentEventsName;

            $scope.inSubcategoryListing = false;

        }else{
            $window.history.back();
        }

    };

});
