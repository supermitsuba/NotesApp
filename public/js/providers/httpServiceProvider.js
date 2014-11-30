var httpServiceProvider = function(){

};

httpServiceProvider.prototype.httpService = {}

httpServiceProvider.prototype.processNotes = function(notes, deletedNotes, normal, success, deleted, failure){
  var isNotModified = true;
  for(var i = 0; i < notes.length; i++){
    if(notes[i].isModified){
      isNotModified = false;
      if(notes[i].id == -1){
        this.saveNote(notes, i, success, failure);
      }
      else{
        this.updateNote(notes, i);
      }
    }
  }

  for(var i = 0; i < deletedNotes.length; i++){
    isNotModified = false;
    var item = _.find(notes, function(j){ return j.id == deletedNotes[i].id; });
    if(item != null){
      var index = notes.indexOf(item);
      if(index > -1){
        notes.splice(index,1);
        this.deleteNote(deletedNotes[i], deleted);
      }
    }
  }

  if(isNotModified){
    normal(notes);
  }
}

httpServiceProvider.prototype.saveNote = function(notes, index, success, failure){
  this.httpService.post('/api/notes', { note: notes[index] }).
    success(function (data, status, headers, config) {
      success(notes, index, data.id);
    }).
    error(function (data, status, headers, config) {
      failure(notes, data);
    });
}

httpServiceProvider.prototype.deleteNote = function(note, deleted){
  this.httpService.delete('/api/notes/'+note.id).
    success(function (data, status, headers, config) {
      deleted(note);
    }).
    error(function (data, status, headers, config) {

    });
}

httpServiceProvider.prototype.updateNote = function(notes, index, success, failure){
  this.httpService.put('/api/notes/'+notes[index].id, { note: notes[index] }).
    success(function (data, status, headers, config) {
      success(index, notes[index].id);
    }).
    error(function (data, status, headers, config) {
      failure(data);
    });
}

httpServiceProvider.prototype.getAllNotes = function(success, failure){
  this.httpService.get('/api/notes').
    success(function (data) {
      success(data);
    }).
    error(function (data, status, headers, config) {
      failure(data);
    });
}