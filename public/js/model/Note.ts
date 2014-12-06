/// <reference path="./Category.ts" />

class Note {
    name: string;
    comment: string;
    createdDate: Date;
    modifiedDate: Date;
    category: Category;
    isModified: boolean;
    isDeleted: boolean;
    id: string;

    constructor(name: string, 
                comment: string, 
                createdDate: Date, 
                modifiedDate: Date, 
                category: Category,
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
    }

    friendlyCreatedDate(){
      return moment(this.createdDate).fromNow();
    }

    friendlyModifiedDate(){
      return moment(this.modifiedDate).fromNow();
    }

    categoryClass(){
        if(this.category === Category.Work){
            return "panel panel-danger";
        }
        else if(this.category === Category.Home){
            return "panel panel-success";
        }
        else{
            return "panel panel-info";
        }
    }
}