function Note (name, comment, createdDate, modifiedDate, category, id, isModified) {
    this.name = name;
    this.comment = comment;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
    this.category = category;
    this.isModified = isModified;
    this.id = id;

    this.friendlyCreatedDate = function(){
      return moment(this.createdDate).fromNow();
    }

    this.friendlyModifiedDate = function(){
      return moment(this.modifiedDate).fromNow();
    }

    this.categoryClass = function(){
        if(this.category === 'work'){
            return "panel panel-danger";
        }
        else if(this.category === 'home'){
            return "panel panel-success";
        }
        else{
            return "panel panel-info";
        }
    }
}
