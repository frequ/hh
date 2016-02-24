'use strict';

angular
    .module('hhApp', [
        'ngRoute',
        'ui.bootstrap'
    ])

    .run(function($rootScope, $location, $window){
      $rootScope.$on('$routeChangeStart', function(event) {
        if ($rootScope.modalInstance) {
          $rootScope.modalInstance.dismiss('close');
          $rootScope.modalInstance = null;
          event.preventDefault();
        }
      });

      $rootScope.$on('$routeChangeSuccess', function() {
          $window.ga('send', 'pageview', { page: $location.url() });
      });
    })

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/category/:categoryId', {
                templateUrl: 'views/category.html',
                controller: 'CategoryCtrl',
                controllerAs: 'category'
            })
            .when('/ruletti', {
                templateUrl: 'views/roulette.html',
                controller: 'RouletteCtrl',
                controllerAs: 'roulette'
            })
            .otherwise({
                redirectTo: '/'
            });


        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

    });
