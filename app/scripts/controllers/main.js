'use strict';

angular.module('hhApp')
  .controller('MainCtrl', function ($scope, HttpService) {

      var getCategories = function(){
        HttpService.GET("categories").then(function(data) {
          var categories = [];
          angular.forEach(data, function(category){
              var obj = {
                  "name": category,
                  "id": category.replace(/ä/g, "a").replace(/ö/g, "o").split(' ').join('-').toLowerCase()
              };
              categories.push(obj);
          });
          $scope.splitMainCategories = [categories.slice(0,3),categories.slice(3,6),categories.slice(6,9)];
      });
    }
    getCategories();

  });
