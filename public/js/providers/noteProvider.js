var noteProvider = function(obj){
	this.httpService = obj.httpService;
	this.localStorageService = obj.localStorageService;
}

noteProvider.prototype.syncNotes = function(notesFunc){
	var localStorageService = this.localStorageService;
	var parent = this;
	
	this.httpService.get('/api/notes').
	    success(function (serverNotes) {
	    	var localNotes = localStorageService.getAllNotes();
	       	//deletes
	       	var deletedNotes = _.filter(localNotes, function(item){
	       		var note = _.find(serverNotes, function(i) {return i.id == item.id;});
	       		return note == null;
	       	});
	       	for(var i = 0; i < deletedNotes.length; i++){
	       		var node = _.find(localNotes, function(item){ return item.id == deletedNotes[i].id;});
	       		var index = localNotes.indexOf(node);
	       		if(index != -1){
	       			localNotes.splice(index, 1);
	       		}
	       	}

	       	localStorageService.saveAllNotes(localNotes);

	       	for(var i = 0; i < localNotes.length; i++){
				if(localNotes[i].isDeleted){
					try{
						parent.deleteNote(localNotes[i], null);
					}
					catch(err){
						
					}
				}
			}
						
			//updates
			for(var i = 0; i < localNotes.length; i++){
				if(localNotes[i].id != -1 && localNotes[i].isModified){
					try{
						parent.updateOneNote(localNotes[i], null);
					}
					catch(err){

					}
				}
			}

			//insert
			for(var i = 0; i < localNotes.length; i++){
				if(localNotes[i].id == -1){
					try{
						parent.saveOneNote(localNotes[i], null);
					}
					catch(err){
						
					}
				}
			}
			
			parent.getAllNotes( notesFunc );
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
	      	if(notesFunc){
				notesFunc(parent.localStorageService.getAllNotes());
			}
	    });
}

noteProvider.prototype.getAllNotes = function(notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.get('/api/notes').
	    success(function (data) {
	    	localStorageService.mergeRecords(data);
	       	if(notesFunc){
	      		notesFunc(localStorageService.getAllNotes());
	      	}
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
	      	if(notesFunc){
				notesFunc(localStorageService.getAllNotes());
			}
	    });
}

noteProvider.prototype.getCategories = function (){
  return ['home', 'work', 'random', ''];
}

noteProvider.prototype.deleteNote = function(note, notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.delete('/api/notes/'+note.id).
	    success(function (data, status, headers, config) {
	      	localStorageService.deleteOneNote(note);
	      	if(notesFunc){
	      		notesFunc(localStorageService.getAllNotes());
	      	}
	    }).
	    error(function (data, status, headers, config) {
	    	console.log('error');
	    	note.isDeleted = true;
	    	note.isModified = true;
	    	note.modifiedDate = new Date();
	    	localStorageService.mergeRecords([note]);
	    	if(notesFunc){
	      		notesFunc(localStorageService.getAllNotes());
	      	}
	    });
}

noteProvider.prototype.newNote = function(){
	return new Note('', '', new Date(), new Date(), '', -1, true);
}

noteProvider.prototype.updateOneNote = function(note, notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.put('/api/notes', { note: note }).
	    success(function (data, status, headers, config) {
	    	note.isModified = false;
	    	localStorageService.saveOneNote(note);
	       	if(notesFunc){
	      		notesFunc(note);
	      	}
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
	    	localStorageService.saveOneNote(note);
	       	if(notesFunc){
	      		notesFunc(note);
	      	}
	    });
}

noteProvider.prototype.saveOneNote = function(note, notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.post('/api/notes', { note: note }).
	    success(function (data, status, headers, config) {
	    	note.id = data.id;
	    	note.isModified = false;
	    	localStorageService.saveOneNote(note);
	       	if(notesFunc){
	      		notesFunc(note);
	      	}
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
	    	localStorageService.saveOneNote(note);
	       	if(notesFunc){
	      		notesFunc(note);
	      	}
	    });
}