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
    .controller('homeContentController', function($scope, $interval, noteFactory) {
        noteFactory.getAllNotes(function(notes){
            $scope.notes = notes;
        });
        
        $scope.categories = noteFactory.getCategories();

        $interval(function() {
            noteFactory.syncNotes(function(notes){
                $scope.notes = notes;
            });
        }, 900000);

        $scope.delete = function(note) {
            var r = confirm("Would you like to delete this record?");
            if (r == false) {
                return;
            }

            noteFactory.deleteNote(note, function(notes){
                $scope.notes = notes;
            });
        };
    })
    .controller('newNoteContentController', function($scope, $state, noteFactory) {
        $scope.note = noteFactory.newNote();
        $scope.categories = noteFactory.getCategories();

        $scope.createNote = function() {
            var note = $scope.note;
            if(note.name == '' || note.name == null){
                alert('Please enter a name for the note!');
                return;
            }

            if(note.comment == '' || note.comment == null){
                note.comment = note.name;
            }

            noteFactory.saveOneNote(note, function(note){
                $state.go('home');
            });            
        };
    });

routerApp.factory('noteFactory', function($http) {
    return new noteProvider({
        localStorageService: new localStorageProvider('notes'),
        httpService:$http
    });    
});

