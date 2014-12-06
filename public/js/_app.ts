/// <reference path="./model/Category.ts" />
/// <reference path="./model/Note.ts" />
/// <reference path="./providers/LocalStorageProvider.ts" />
/// <reference path="./providers/NoteProvider.ts" />

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
        noteFactory.syncNotes(function(notes){
            $scope.notes = _.filter(notes, function(i){return !notes.isDeleted;});
        });
        
        $scope.categories = noteFactory.getCategories();

        $interval(function() {
            noteFactory.syncNotes(function(notes){
                $scope.notes = _.filter(notes, function(i){return !notes.isDeleted;});
            });
        }, 30000);

        $scope.delete = function(note) {
            var r = confirm("Would you like to delete this record?");
            if (r == false) {
                return;
            }

            noteFactory.deleteNote(note, function(notes){
                $scope.notes = _.filter(notes, function(i){return !notes.isDeleted;});
            });
        };
    })
    .controller('newNoteContentController', function($scope, $state, noteFactory) {
        $scope.note = noteFactory.newNote();
        $scope.categories = noteFactory.getCategories();

        $scope.createNote = function() {
            var note:Note = $scope.note;
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
    return new NoteProvider(
                    new LocalStorageProvider('notes'),
                    $http
                );    
});

