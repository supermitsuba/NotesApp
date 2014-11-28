function httpServiceProvider(){
  this.httpService = {};

  this.processNotes = function(notes, normal, success, failure){
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

    if(isNotModified){
      normal(notes);
    }

    return notes;
  }

  this.saveNote = function(notes, index, success, failure){
    this.httpService.post('/api/notes', { note: notes[index] }).
      success(function (data, status, headers, config) {
        success(notes, index, data.id);
      }).
      error(function (data, status, headers, config) {
        failure(notes, data);
      });
  }

  this.deleteNote = function(note){

  }

  this.updateNote = function(notes, index, success, failure){
    this.httpService.put('/api/notes/'+notes[index].id, { note: notes[index] }).
      success(function (data, status, headers, config) {
        success(index, notes[index].id);
      }).
      error(function (data, status, headers, config) {
        failure(data);
      });
  }

  this.getAllNotes = function(success, failure){
    this.httpService.get('/api/notes').
      success(function (data) {
        success(data);
      }).
      error(function (data, status, headers, config) {
        failure(data);
      });
  }

}
