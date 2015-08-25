'use strict';

describe('Controller: CategoryCtrl - Harjoita mielen tasapainoa tests', function () {

    var $httpBackend, scope, routeParams;

    beforeEach(module('hhApp'));

    beforeEach(inject(function($injector, $rootScope, $controller){

        routeParams = {'categoryId': 'harjoita-mielen-tasapainoa'};

        $httpBackend = $injector.get('$httpBackend');
        jasmine.getJSONFixtures().fixturesPath='base/app/json';

        $httpBackend.whenGET('json/'+ routeParams.categoryId +'.json').respond(
            getJSONFixture('harjoita-mielen-tasapainoa.json') // jshint ignore:line
        );

        scope = $rootScope.$new();
        $controller('CategoryCtrl', {'$scope': scope, '$routeParams': routeParams});

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have name: "Harjoita mielen tasapainoa"', function(){
        $httpBackend.flush();
        expect(scope.eventsName).toEqual('Harjoita mielen tasapainoa');
    });

    it('should have lead', function(){
        $httpBackend.flush();
        expect(scope.eventsLead).toExist();
    });

    it('should have events', function(){
        $httpBackend.flush();
        expect(scope.events.length).toBe(14);
    });

});
