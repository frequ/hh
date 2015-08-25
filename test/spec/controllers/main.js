'use strict';

describe('Controller: MainCtrl', function () {

    var $httpBackend, scope;

    // load the controller's module
    beforeEach(module('hhApp'));

    beforeEach(inject(function($injector, $rootScope, $controller){

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        jasmine.getJSONFixtures().fixturesPath='base/app/json';

        $httpBackend.whenGET('json/categories.json').respond(
            getJSONFixture('categories.json') // jshint ignore:line
        );

        scope = $rootScope.$new();
        $controller('MainCtrl', {'$scope': scope});

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get results and should attach an array of arrays (categories) to scope', function(){
        $httpBackend.flush();
        expect(scope.splitMainCategories.length).toBe(3);
    });

});
