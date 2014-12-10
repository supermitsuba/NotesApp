/// <reference path="./Category.ts" />

class Note {
    name: string;
    comment: string;
    createdDate: Date;
    modifiedDate: Date;
    category: string;
    isModified: boolean;
    isDeleted: boolean;
    id: string;
    isNotDeleted: boolean;

    constructor(name: string, 
                comment: string, 
                createdDate: Date, 
                modifiedDate: Date, 
                category: string,
                id: string, 
                isModified: boolean, 
                isDeleted: boolean) {
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

    copyNote(updatedNote:Note){
        this.name = updatedNote.name;
        this.comment = updatedNote.comment;
        this.createdDate = updatedNote.createdDate;
        this.modifiedDate = updatedNote.modifiedDate;
        this.category = updatedNote.category;
        this.isModified = updatedNote.isModified;
        this.isDeleted = updatedNote.isDeleted;  
        this.isNotDeleted = !updatedNote.isDeleted;  
    }

    equals(otherNote:Note){
        if(this.id === otherNote.id && this.id !== "-1"){
            return true;
        }

        if(this.name === otherNote.name &&
            this.comment === otherNote.comment &&
            this.createdDate === otherNote.createdDate &&
            this.category === otherNote.category){
            return true;
        }
        else{
            return false;
        }
    }

    friendlyCreatedDate(){
      return moment(this.createdDate).fromNow();
    }

    friendlyModifiedDate(){
      return moment(this.modifiedDate).fromNow();
    }

    categoryClass(){
        if(this.category === 'Work'){
            return "panel panel-danger";
        }
        else if(this.category === 'Home'){
            return "panel panel-success";
        }
        else{
            return "panel panel-info";
        }
    }
}