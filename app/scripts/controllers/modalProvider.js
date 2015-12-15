'use strict';

angular.module('hhApp')
  .service('modalProvider', ['$modal', function ($modal){

      this.openModal = function(event){
        var items = event;

        $modal.open({
            templateUrl: 'views/eventModal.html',
            controller: 'EventModalCtrl',
            resolve: {
               items: function(){
                   return items;
               }
            }
        });
    };

  }]);
