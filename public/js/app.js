
var routerApp = angular.module('notes', ['ui.router']);
var noteStorage = new localStorageProvider('mycrappydata');
var deletedStorage = new localStorageProvider('deleteddata');
var httpProvider = new httpServiceProvider();

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
        $scope.notes = noteStorage.getAllNotes();
        $scope.categories = getCategories();

        httpProvider.httpService = $http;
        httpProvider.getAllNotes(
            function(data){
                noteStorage.mergeRecords(data);
                $scope.notes = noteStorage.getAllNotes();
                saveNotes($http, $scope);
            },
            function(err){
                $scope.notes = noteStorage.getAllNotes();
            }
        );

        $scope.delete = function(note) {

          var r = confirm("Would you like to delete this record?");
          if (r == false) {
            return;
          }

          var index = $scope.notes.indexOf(note);
          if(index > -1){
            $scope.notes.splice(index,1);
          }

          if(note.id != -1){
            deletedStorage.saveOneNote(note);
          }

          noteStorage.saveAllNotes($scope.notes);
          saveNotes($http, $scope);
        };
    })
    .controller('newNoteContentController', function($scope, $state, $http) {
        $scope.note = new Note('', '', new Date(), new Date(), '', -1, true);
        $scope.categories = getCategories();

        $scope.createNote = function() {
            var note = $scope.note;
            if(note.name == '' || note.name == null){
                alert('Please enter a name for the note!');
                return;
            }

            if(note.comment == '' || note.comment == null){
                note.comment = note.name;
            }

            noteStorage.saveOneNote(note);

            $state.go('home');
        };
    });
    
function saveNotes(http, scope){
    httpProvider.httpService = http

    httpProvider.processNotes(
        noteStorage.getAllNotes(),
        deletedStorage.getAllNotes(),

        //unmodified
        function(notes){
            scope.notes = notes;
        },
        //insert or update
        function(notes, index, newId){
            notes[index].id = newId;
            notes[index].isModified = false;
            noteStorage.saveAllNotes(notes);
            scope.notes = notes;
        },
        //delete
        function(note){
            //removed deleted note from list
            deletedStorage.deleteOneNote(note);
        },
        //error
        function(notes, errorData)
        {
            scope.notes = notes;
        }
    );
}

function getCategories(){
  return ['home', 'work', 'random', ''];
}
