function Note (name, comment, createdDate, modifiedDate, category) {
    this.name = name;
    this.comment = comment;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
    this.category = category;
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
