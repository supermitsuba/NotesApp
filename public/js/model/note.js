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
