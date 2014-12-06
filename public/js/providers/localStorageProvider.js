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
