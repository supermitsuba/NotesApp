
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
        $scope.notes = getListOfNotes();
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

          localStorage["mycrappydata"] = JSON.stringify($scope.notes);
        };
    })
    .controller('newNoteContentController', function($scope, $state, $http) {
        $scope.note = new Note('', '', new Date(), new Date(), '');
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

            var listOfNotes = getListOfNotes();
            listOfNotes.push(note);
            localStorage["mycrappydata"] = JSON.stringify(listOfNotes);
            $scope.note = new Note('', '', new Date(), new Date(), '');
            $state.go('home');
        };
    });

function getCategories(){
  return ['home', 'work', 'random', ''];
}

function getListOfNotes(){

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

  return listNotes;
}
