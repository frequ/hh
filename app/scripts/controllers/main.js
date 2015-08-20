'use strict';

angular.module('hhApp')
  .controller('MainCtrl', function ($scope, $http, $log) {

      (function(){
         var promise = $http.get('json/categories.json');
         promise
            .success(function(data){

                var categories = [];
                angular.forEach(data, function(category){
                    var obj = {
                        "name": category,
                        "id": category.replace(/ä/g, "a").replace(/ö/g, "o").split(' ').join('-').toLowerCase()
                    };
                    categories.push(obj);

                });

                $scope.splitMainCategories = [categories.slice(0,3),categories.slice(3,6),categories.slice(6,9)];
            })
            .error(function(){
                $log.warn('error fetching static content from json');
            });
      })();
  });
