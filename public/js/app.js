
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
        })
        .state('newNote',{
            url : '/newNote',
            views: {
                'content' : {
                    templateUrl: 'partials/createNote/content.html',
                    controller: 'newNoteContentController'
                }
            }
        });
    });

routerApp
    .controller('homeContentController', function($scope, $stateParams, $http) {
        var homenote = new Note('New Note', 'here is a new note', new Date(), new Date(), 'home');
        var worknote = new Note('New Note2', 'here is a new note', new Date(), new Date(), 'work');
        var randnote = new Note('New Note3', 'here is a new note', new Date(), new Date(), 'random');

        if(localStorage["mycrappydata"]==null){
          localStorage["mycrappydata"] = JSON.stringify([ homenote, worknote, randnote ]);
        }

        var list = JSON.parse(localStorage["mycrappydata"]);
        var listNotes = [];

        for(var i = 0; i < list.length; i++){
            var newItem = new Note(list[i].name,
              list[i].comment,
              list[i].createdDate,
              list[i].modifiedDate,
              list[i].category
            );
            listNotes.push( newItem );
        }

        $scope.notes = listNotes;
    })
    .controller('newNoteContentController', function($scope, $stateParams, $http) {
        var homenote = new Note('', '', new Date(), new Date(), '');
        $scope.note = homenote;
    });
