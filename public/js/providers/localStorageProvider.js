var localStorageProvider = function (key){
  this.localStorageKey = key;
}

localStorageProvider.prototype.saveAllNotes = function(notes){
  localStorage[this.localStorageKey] = JSON.stringify(notes);
}

localStorageProvider.prototype.getAllNotes = function(){
  var list = [];
  try{
     list = JSON.parse(localStorage[this.localStorageKey]);
  }
  catch(err)
  {
    list = [];
  }
  var listNotes = [];

  for(var i = 0; i < list.length; i++){
    var newItem = new Note(list[i].name,
      list[i].comment,
      list[i].createdDate,
      list[i].modifiedDate,
      list[i].category,
      list[i].id,
      list[i].isModified
    );
    listNotes.push( newItem );
  }

  return listNotes;
}

localStorageProvider.prototype.saveOneNote = function(note){
  var listOfNotes = this.getAllNotes();
  listOfNotes.push(note);
  this.saveAllNotes(listOfNotes);
}

localStorageProvider.prototype.deleteOneNote = function(note){
  var listOfNotes = this.getAllNotes();
  var index = listOfNotes.indexOf(note);
  if(index > -1){
    listOfNotes.splice(index,1);
  }
  this.saveAllNotes(listOfNotes);
}

localStorageProvider.prototype.mergeRecords = function(newNotes){
  var list = JSON.parse(localStorage[this.localStorageKey]);

  for(var i = 0; i < newNotes.length; i++){
    var selectedItem = _.find(list, function(item){ return item.id == newNotes[i].id && item.id != -1; } );

    if(selectedItem == null){
      var newItem = new Note(newNotes[i].name,
        newNotes[i].comment,
        newNotes[i].createdDate,
        newNotes[i].modifiedDate,
        newNotes[i].category,
        newNotes[i].id,
        newNotes[i].isModified
      );
      list.push( newItem );
    }
    else if(selectedItem.isModified > newNotes[i].isModified){
      var index = list.indexOf(selectedItem);
      list[index].name = newNotes[i].name;
      list[index].comment = newNotes[i].comment;
      list[index].modifiedDate = newNotes[i].modifiedDate;
      list[index].category = newNotes[i].category;
    }
  }

  this.saveAllNotes(list);    
}