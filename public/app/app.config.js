angular.module('myApp')
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/home', {
                template: '<home-component></home-component>'
            })
            .when('/howto', {
                template: '<howto-component></home-component>'
            })
            .when('/submit', {
                template: '<submit-component></submit-component>'
            })
            .when('/about', {
                template: '<about-component></about-component>'
            })
            .otherwise('/home');
}]);
