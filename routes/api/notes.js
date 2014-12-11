var path = require('path');  
var fs = require('fs');

var database;

module.exports = function (app, db) {
  database = db;

  app.post('/api/notes', insertNote);
  app.put('/api/notes/:id', updateNote);
  app.delete('/api/notes/:id', deleteNote);
  app.get('/api/notes', getAllNotes);
};

function insertNote(req, res){
  var note = req.body.note;
  if(note.id != -1){
      res.status(400).send('The id was not -1, so this is a put, not a post.')
      res.end();
      return;
  }

  database.insert(note, function (err, newNote) {
    if(err != null){
      res.status(500).send('A error happened in saving the record.');
      res.end();
      return;
    }
    newNote.id = newNote._id;
    res.status(200).send(newNote);
    res.end();
    return;
  });
};

function updateNote(req, res){
  var note = req.body.note;
  var noteId = req.query.id;
  if(note.id == -1 && noteId == -1 && noteId == null){
    res.status(400).send('The id was -1, so this is a post, not a put.')
    res.end();
    return;
  }

  database.update({ _id:noteId }, note, {}, function (err, updatedNote) {
    if(err != null){
      res.status(500).send('A error happened in saving the record.');
      res.end();
      return;
    }

    res.status(200).send(updatedNote);
    res.end();
    return;
  });
};

function deleteNote(req, res){
  var noteId = req.params.id;
  if(noteId == null || noteId == ''){
    res.status(400).send('There was not id.')
    res.end();
    return;
  }

  database.remove({_id: noteId}, {}, function (err, removedId) {
    if(err != null){
      res.status(500).send('A error happened in saving the record.');
      res.end();
      return;
    }

    res.status(200).send(noteId);
    res.end();
    return;
  });

}

function getAllNotes(req, res){
  database.find({}, function (err, notes) {
    if(err != null){
      res.status(500).send('A error happened in saving the record.');
      res.end();
      return;
    }

    for(var i = 0; i < notes.length; i++){
      notes[i].id = notes[i]._id;
      notes[i].isModified = false;
    }

    res.status(200).send(notes.sort(function(a, b) {
        a = new Date(a.modifiedDate);
        b = new Date(b.modifiedDate);
        return a>b ? -1 : a<b ? 1 : 0;
    }).reverse());
    res.end();
    return;
  });
};
