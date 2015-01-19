var Category = ['', 'Home', 'Work', 'Random'];
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
        this.isNotDeleted = !isDeleted;
    }
    Note.prototype.copyNote = function (updatedNote) {
        this.name = updatedNote.name;
        this.comment = updatedNote.comment;
        this.createdDate = updatedNote.createdDate;
        this.modifiedDate = updatedNote.modifiedDate;
        this.category = updatedNote.category;
        this.isModified = updatedNote.isModified;
        this.isDeleted = updatedNote.isDeleted;
        this.isNotDeleted = !updatedNote.isDeleted;
    };
    Note.prototype.equals = function (otherNote) {
        if (this.id === otherNote.id && this.id !== "-1") {
            return true;
        }
        if (this.name === otherNote.name && this.comment === otherNote.comment && this.createdDate === otherNote.createdDate && this.category === otherNote.category) {
            return true;
        }
        else {
            return false;
        }
    };
    Note.prototype.friendlyCreatedDate = function () {
        return moment(this.createdDate).fromNow();
    };
    Note.prototype.friendlyModifiedDate = function () {
        return moment(this.modifiedDate).fromNow();
    };
    Note.prototype.categoryClass = function () {
        if (this.category === 'Work') {
            return "panel panel-danger";
        }
        else if (this.category === 'Home') {
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
        localStorage[this.key] = JSON.stringify(notes);
    };
    LocalStorageProvider.prototype.getAllNotes = function () {
        var list = [];
        try {
            list = JSON.parse(localStorage[this.key]);
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
        for (var i = 0; i < listOfNotes.length; i++) {
            if (listOfNotes[i].equals(note)) {
                listOfNotes[i].copyNote(note);
            }
        }
        this.saveAllNotes(listOfNotes);
    };
    LocalStorageProvider.prototype.deleteOneNote = function (note) {
        var listOfNotes = this.getAllNotes();
        for (var i = 0; i < listOfNotes.length; i++) {
            if (listOfNotes[i].equals(note)) {
                listOfNotes.splice(i, 1);
                break;
            }
        }
        this.saveAllNotes(listOfNotes);
    };
    LocalStorageProvider.prototype.mergeRecords = function (newNotes) {
        var list = this.getAllNotes();
        for (var i = 0; i < newNotes.length; i++) {
            var selectedItem = _.find(list, function (item) {
                return item.equals(newNotes[i]);
            });
            if (selectedItem == null) {
                var newItem = new Note(newNotes[i].name, newNotes[i].comment, newNotes[i].createdDate, newNotes[i].modifiedDate, newNotes[i].category, newNotes[i].id, newNotes[i].isModified, newNotes[i].isDeleted);
                list.push(newItem);
            }
            else if (moment(selectedItem.modifiedDate).isBefore(newNotes[i].modifiedDate)) {
                var index = list.indexOf(selectedItem);
                list[index].copyNote(newNotes[i]);
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
    function NoteProvider(localStorageService, httpService, promise) {
        this.httpService = httpService;
        this.localStorageService = localStorageService;
        this.promise = promise;
    }
    NoteProvider.prototype.isOnline = function (myFunc) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myFunc(true);
            }
            else {
                myFunc(false);
            }
        };
        xmlhttp.open("GET", "online.txt", true);
        xmlhttp.send();
    };
    NoteProvider.prototype.syncNotes = function (notesFunc) {
        var localStorageService = this.localStorageService;
        var localNotes = localStorageService.getAllNotes();
        var failedBunch = [];
        var urlCalls = [];
        for (var i = 0; i < localNotes.length; i++) {
            var note = localNotes[i];
            if (note.id == '-1' && note.isDeleted == false && note.isModified) {
                urlCalls.push(this.httpService.post('/api/notes', { note: note }));
            }
            else if (note.id != '-1' && note.isDeleted == false && note.isModified) {
                urlCalls.push(this.httpService.put('/api/notes', { note: note }));
            }
            else if (note.id != '-1' && note.isModified) {
                urlCalls.push(this.httpService.delete('/api/notes/' + note.id));
            }
        }
        var func = notesFunc;
        var http = this.httpService;
        var p = this.promise;
        this.isOnline(function (isServerOnline) {
            if (isServerOnline) {
                p.all(urlCalls).then(function (results) {
                    http.get('/api/notes', { cache: false, timeout: 200 }).success(function (data, status, headers, config) {
                        localStorageService.saveAllNotes(data);
                        func(localStorageService.getAllNotes());
                    }).error(function (data, status, headers, config) {
                        console.log('Get All Notes - Error');
                        if (notesFunc) {
                            notesFunc(localStorageService.getAllNotes());
                        }
                    });
                }, function (errors) {
                    func(localStorageService.getAllNotes());
                }, function (updates) {
                });
            }
            else {
                func(localStorageService.getAllNotes());
            }
        });
    };
    NoteProvider.prototype.getAllNotes = function (notesFunc) {
        var localStorageService = this.localStorageService;
        this.httpService.get('/api/notes').success(function (data) {
            console.log('Get All Notes - Success');
            if (notesFunc) {
                notesFunc(localStorageService.getAllNotes());
            }
        }).error(function (data, status, headers, config) {
            console.log('Get All Notes - Error');
            if (notesFunc) {
                notesFunc(localStorageService.getAllNotes());
            }
        });
    };
    NoteProvider.prototype.getCategories = function () {
        return Category;
    };
    NoteProvider.prototype.deleteNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.isOnline(function (isServerOnline) {
            if (isServerOnline) {
                this.httpService.delete('/api/notes/' + note.id).success(function (data, status, headers, config) {
                    console.log('Delete Note - Success');
                    localStorageService.deleteOneNote(note);
                    if (notesFunc) {
                        notesFunc(localStorageService.getAllNotes());
                    }
                }).error(function (data, status, headers, config) {
                    console.log('Delete Note - Error');
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
            }
            else {
                console.log('Note - not online');
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
            }
        });
    };
    NoteProvider.prototype.newNote = function () {
        return new Note('', '', new Date(), new Date(), '', "-1", true, false);
    };
    NoteProvider.prototype.updateOneNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.isOnline(function (isServerOnline) {
            if (isServerOnline) {
                this.httpService.put('/api/notes', { note: note }).success(function (data, status, headers, config) {
                    console.log('Update Note - Success');
                    note.isModified = false;
                    localStorageService.updateOneNote(note);
                    if (notesFunc) {
                        notesFunc(note);
                    }
                }).error(function (data, status, headers, config) {
                    console.log('Update Note - Error');
                    localStorageService.updateOneNote(note);
                    if (notesFunc) {
                        notesFunc(note);
                    }
                });
            }
            else {
                console.log('Update Note - offline');
                localStorageService.updateOneNote(note);
                if (notesFunc) {
                    notesFunc(note);
                }
            }
        });
    };
    NoteProvider.prototype.saveOneNote = function (note, notesFunc) {
        var localStorageService = this.localStorageService;
        this.isOnline(function (isServerOnline) {
            if (isServerOnline) {
                this.httpService.post('/api/notes', { note: note }).success(function (data, status, headers, config) {
                    console.log('Save Note - Success');
                    note.id = data.id;
                    note.isModified = false;
                    localStorageService.saveOneNote(note);
                    if (notesFunc) {
                        notesFunc(note);
                    }
                }).error(function (data, status, headers, config) {
                    console.log('Save Note - Error');
                    localStorageService.saveOneNote(note);
                    if (notesFunc) {
                        notesFunc(note);
                    }
                });
            }
            else {
                console.log('Save Note - Offline');
                localStorageService.saveOneNote(note);
                if (notesFunc) {
                    notesFunc(note);
                }
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
        $scope.notes = notes;
    });
    $scope.categories = noteFactory.getCategories();
    $interval(function () {
        noteFactory.syncNotes(function (notes) {
            $scope.notes = notes;
        });
    }, 30000);
    $scope.delete = function (note) {
        var r = confirm("Would you like to delete this record?");
        if (r == false) {
            return;
        }
        noteFactory.deleteNote(note, function (notes) {
            $scope.notes = notes;
        });
    };
}).controller('newNoteContentController', function ($scope, $state, noteFactory) {
    $scope.note = noteFactory.newNote();
    $scope.categories = noteFactory.getCategories();
    $scope.createNote = function () {
        var note = $scope.note;
        if (note.name == '' || note.name == null) {
            alert('Please enter a name  for the note!');
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
routerApp.factory('noteFactory', function ($http, $log, $q) {
    return new NoteProvider(new LocalStorageProvider('notes'), $http, $q);
});
