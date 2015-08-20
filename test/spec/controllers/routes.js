'use strict';

describe('Testing Routes', function () {

    beforeEach(module('hhApp'));

    it('should test routes',
    inject(function ($route) {

        expect($route.routes['/'].controller).toBe('MainCtrl');
        expect($route.routes['/'].templateUrl).toEqual('views/main.html');

        expect($route.routes['/category/:categoryId'].controller).toBe('CategoryCtrl');
        expect($route.routes['/category/:categoryId'].templateUrl).toEqual('views/category.html');

        expect($route.routes['/ruletti'].controller).toBe('RouletteCtrl');
        expect($route.routes['/ruletti'].templateUrl).toEqual('views/roulette.html');


        expect($route.routes[null].redirectTo).toEqual('/');
    }));

});
