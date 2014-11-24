
var routerApp = angular.module('notes', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('home', {
            url : '/',
            views : {
                'content': {
                    templateUrl: 'partials/home/content.html',
                    controller: 'homeContentController'
                }
            }            
        });
    });

routerApp
    .controller('sidebarController', function($scope, $http) {
        
    })
    .controller('homeContentController', function($scope, $stateParams, $http) {
        var homenote = new Note('New Note', 'here is a new note', moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), 'home');
        var worknote = new Note('New Note2', 'here is a new note', moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), 'work');
        var randnote = new Note('New Note3', 'here is a new note', moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'), 'random');
        $scope.notes = [ homenote, worknote, randnote ];
    });