var Category;
(function (Category) {
    Category[Category["None"] = -1] = "None";
    Category[Category["Home"] = 0] = "Home";
    Category[Category["Work"] = 1] = "Work";
    Category[Category["Random"] = 2] = "Random";
})(Category || (Category = {}));
;
/// <reference path="./Category.ts" />
var Note = (function () {
    function Note(name, comment, createdDate, modifiedDate, category, id, isModified, isDeleted) {
        this.name = name;
        this.comment = comment;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.category = category;
        this.id = id;
        this.isModified = isModified;
        this.isDeleted = isDeleted;
    }
    Note.prototype.friendlyCreatedDate = function () {
        return moment(this.createdDate).fromNow();
    };
    Note.prototype.friendlyModifiedDate = function () {
        return moment(this.modifiedDate).fromNow();
    };
    Note.prototype.categoryClass = function () {
        if (this.category === 1 /* Work */) {
            return "panel panel-danger";
        }
        else if (this.category === 0 /* Home */) {
            return "panel panel-success";
        }
        else {
            return "panel panel-info";
        }
    };
    return Note;
})();
/// <reference path="../model/Category.ts" />
/// <reference path="../model/Note.ts" />
var LocalStorageProvider = (function () {
    function LocalStorageProvider(key) {
        this.key = key;
    }
    LocalStorageProvider.prototype.saveAllNotes = function (notes) {
        localStorage[this.localStorageKey] = JSON.stringify(notes);
    };
    LocalStorageProvider.prototype.getAllNotes = function () {
        var list = [];
        try {
            list = JSON.parse(localStorage[this.localStorageKey]);
        }
        catch (err) {
            list = [];
        }
        var listNotes = [];
        for (var i = 0; i < list.length; i++) {
            var newItem = new Note(list[i].name, list[i].comment, list[i].createdDate, list[i].modifiedDate, list[i].category, list[i].id, list[i].isModified, list[i].isDeleted);
            listNotes.push(newItem);
        }
        return listNotes;
    };
    LocalStorageProvider.prototype.saveOneNote = function (note) {
        var listOfNotes = this.getAllNotes();
        listOfNotes.push(note);
        this.saveAllNotes(listOfNotes);
    };
    LocalStorageProvider.prototype.updateOneNote = function (note) {
        var listOfNotes = this.getAllNotes();
        var item = _.find(listOfNotes, function (i) {
            return i.id = note.id;
        });
        var index = listOfNotes.indexOf(item);
        if (index > -1) {
            listOfNotes[index] = note;
        }
        this.saveAllNotes(listOfNotes);
    };
    LocalStorageProvider.prototype.deleteOneNote = function (note) {
        var listOfNotes = this.getAllNotes();
        var index = listOfNotes.indexOf(note);
        if (index > -1) {
            listOfNotes.splice(index, 1);
        }
        this.saveAllNotes(listOfNotes);
    };
    LocalStorageProvider.prototype.mergeRecords = function (newNotes) {
        var list = this.getAllNotes();
        for (var i = 0; i < newNotes.length; i++) {
            var selectedItem = _.find(list, function (item) {
                return item.id == newNotes[i].id && item.id != -1;
            });
            if (selectedItem == null) {
                var newItem = new Note(newNotes[i].name, newNotes[i].comment, newNotes[i].createdDate, newNotes[i].modifiedDate, newNotes[i].category, newNotes[i].id, newNotes[i].isModified, newNotes[i].isDeleted);
                list.push(newItem);
            }
            else if (moment(selectedItem.modifiedDate).isBefore(newNotes[i].modifiedDate)) {
                var index = list.indexOf(selectedItem);
                list[index].name = newNotes[i].name;
                list[index].comment = newNotes[i].comment;
                list[index].modifiedDate = newNotes[i].modifiedDate;
                list[index].category = newNotes[i].category;
                list[index].isModified = newNotes[i].isModified;
                list[index].isDeleted = newNotes[i].isDeleted;
            }
        }
        this.saveAllNotes(list);
    };
    return LocalStorageProvider;
})();
/// <reference path="../model/Category.ts" />
/// <reference path="../model/Note.ts" />
/// <reference path="../providers/LocalStorageProvider.ts" />
var NoteProvider = (function () {
    function NoteProvider(localStorageService, httpService) {
        this.httpService = httpService;
        this.localStorageService = localStorageService;
    }
    NoteProvider.prototype.syncNotes = function (notesFunc) {
        this.getAllNotes(notesFunc);
    };
    NoteProvider.prototype.getAllNotes = function (notesFunc) {
        var localStorageService = this.localStorageService;
        this.httpService.get('/api/notes').success(function (data) {
            if (notesFunc) {
                notesFunc(localStorageService.getAllNotes());
            }
        }).error(function (data, status, headers, config) {
            console.log('error');
            if (notesFunc) {
                notesFunc(localStorageService.getAllNotes());
            }
        });
    };
    NoteProvider.prototype.getCategories = function () {
        var list = [];
        for (var enumMember in Category) {
            list.push(enumMember);
        }
        return list;
    };
    NoteProvider.prototype.deleteNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.httpService.delete('/api/notes/' + note.id).success(function (data, status, headers, config) {
            localStorageService.deleteOneNote(note);
            if (notesFunc) {
                notesFunc(localStorageService.getAllNotes());
            }
        }).error(function (data, status, headers, config) {
            console.log('error');
            if (note.id == "-1") {
                localStorageService.deleteOneNote(note);
                if (notesFunc) {
                    notesFunc(localStorageService.getAllNotes());
                }
            }
            else {
                note.isDeleted = true;
                note.isModified = true;
                note.modifiedDate = new Date();
                localStorageService.updateOneNote(note);
                if (notesFunc) {
                    notesFunc(localStorageService.getAllNotes());
                }
            }
        });
    };
    NoteProvider.prototype.newNote = function () {
        return new Note('', '', new Date(), new Date(), -1 /* None */, "-1", true, false);
    };
    NoteProvider.prototype.updateOneNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.httpService.put('/api/notes', { note: note }).success(function (data, status, headers, config) {
            note.isModified = false;
            localStorageService.updateOneNote(note);
            if (notesFunc) {
                notesFunc(note);
            }
        }).error(function (data, status, headers, config) {
            console.log('error');
            localStorageService.updateOneNote(note);
            if (notesFunc) {
                notesFunc(note);
            }
        });
    };
    NoteProvider.prototype.saveOneNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.httpService.post('/api/notes', { note: note }).success(function (data, status, headers, config) {
            note.id = data.id;
            note.isModified = false;
            localStorageService.saveOneNote(note);
            if (notesFunc) {
                notesFunc(note);
            }
        }).error(function (data, status, headers, config) {
            console.log('error');
            localStorageService.saveOneNote(note);
            if (notesFunc) {
                notesFunc(note);
            }
        });
    };
    return NoteProvider;
})();
/// <reference path="./model/Category.ts" />
/// <reference path="./model/Note.ts" />
/// <reference path="./providers/LocalStorageProvider.ts" />
/// <reference path="./providers/NoteProvider.ts" />
var routerApp = angular.module('notes', ['ui.router']);
routerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'partials/home/content.html',
                controller: 'homeContentController'
            }
        }
    }).state('newNote', {
        url: '/newNote',
        views: {
            'content': {
                templateUrl: 'partials/createNote/content.html',
                controller: 'newNoteContentController'
            }
        }
    });
});
routerApp.controller('homeContentController', function ($scope, $interval, noteFactory) {
    noteFactory.syncNotes(function (notes) {
        $scope.notes = _.filter(notes, function (i) {
            return !notes.isDeleted;
        });
    });
    $scope.categories = noteFactory.getCategories();
    $interval(function () {
        noteFactory.syncNotes(function (notes) {
            $scope.notes = _.filter(notes, function (i) {
                return !notes.isDeleted;
            });
        });
    }, 30000);
    $scope.delete = function (note) {
        var r = confirm("Would you like to delete this record?");
        if (r == false) {
            return;
        }
        noteFactory.deleteNote(note, function (notes) {
            $scope.notes = _.filter(notes, function (i) {
                return !notes.isDeleted;
            });
        });
    };
}).controller('newNoteContentController', function ($scope, $state, noteFactory) {
    $scope.note = noteFactory.newNote();
    $scope.categories = noteFactory.getCategories();
    $scope.createNote = function () {
        var note = $scope.note;
        if (note.name == '' || note.name == null) {
            alert('Please enter a name for the note!');
            return;
        }
        if (note.comment == '' || note.comment == null) {
            note.comment = note.name;
        }
        noteFactory.saveOneNote(note, function (note) {
            $state.go('home');
        });
    };
});
routerApp.factory('noteFactory', function ($http) {
    return new NoteProvider(new LocalStorageProvider('notes'), $http);
});
