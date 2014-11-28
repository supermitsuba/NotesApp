
var routerApp = angular.module('notes', ['ui.router']);
var localStorageProvider = new localStorageProvider('mycrappydata');
//var deletedStorageProvider = new localStorageProvider('deleteddata');
var httpServiceProvider = new httpServiceProvider();

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
        httpServiceProvider.httpService = $http;
        httpServiceProvider.getAllNotes(
            function(data){
                localStorageProvider.mergeRecords(data);
                $scope.notes = localStorageProvider.getAllNotes();
            },
            function(err){
                $scope.notes = localStorageProvider.getAllNotes();
            }
        );
        $scope.categories = getCategories();

        $scope.delete = function(note) {

          var r = confirm("Would you like to delete this record?");
          if (r == false) {
            return;
          }

          var index = $scope.notes.indexOf(note);
          if(index > -1){
            $scope.notes.splice(index,1);
          }

          localStorageProvider.saveAllNotes($scope.notes);
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

            localStorageProvider.saveOneNote(note);
            $state.go('home');
        };
    });
function saveNotes(){
    httpServiceProvider.httpService = $http

    var listOfNotes = httpServiceProvider.processNotes(
                        localStorageProvider.getAllNotes(),
                        function(notes){
                            $scope.notes = notes;
                        },
                        function(notes, index, newId){
                            notes[index].id = newId;
                            notes[index].isModified = false;
                            localStorageProvider.saveAllNotes(notes);
                            $scope.notes = notes;
                        },
                        function(notes, errorData)
                        {
                            $scope.notes = notes;
                        });
}

function getCategories(){
  return ['home', 'work', 'random', ''];
}
