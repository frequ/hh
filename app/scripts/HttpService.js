'use strict';

angular.module('hhApp')
.factory('HttpService', function($http, $log, $q) {

  var HttpService = {};
  var url = 'json/';
  // var url = 'https://www.miinasillanpaa.fi/json/';

  HttpService.GET = function(whatToGet) {
    // whatToGet is either a string "categories" or "roulette" or
    // it can be a categoryId string

    var data = null;
    var deferred = $q.defer();
    if (data !== null) {
      deferred.resolve(data);
    }

    $http.get(url + whatToGet + ".json")
      .success(function(data) {
        deferred.resolve(data);
      }).error(deferred.reject);

    return deferred.promise;
  };

  return HttpService;
});
