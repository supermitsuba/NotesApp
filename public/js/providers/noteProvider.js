var noteProvider = function(obj){
	this.httpService = obj.httpService;
	this.localStorageService = obj.localStorageService;
}

noteProvider.prototype.getAllNotes = function(notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.get('/api/notes').
	    success(function (data) {
	    	localStorageService.mergeRecords(data);
	      	notesFunc(localStorageService.getAllNotes());
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
			notesFunc(this.localStorageService.getAllNotes());
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
	      	notesFunc(localStorageService.getAllNotes());
	    }).
	    error(function (data, status, headers, config) {
	    	console.log('error');
	    	note.isDeleted = true;
	    	note.isModified = true;
	    	note.modifiedDate = new Date();
	    	localStorageService.mergeRecords([note]);
	      	notesFunc(localStorageService.getAllNotes());
	    });
}

noteProvider.prototype.newNote = function(){
	return new Note('', '', new Date(), new Date(), '', -1, true);
}

noteProvider.prototype.saveOneNote = function(note, notesFunc){
	var localStorageService = this.localStorageService;

	this.httpService.post('/api/notes', { note: note }).
	    success(function (data, status, headers, config) {
	    	note.id = data.id;
	    	localStorageService.saveOneNote(note);
	      	notesFunc(note);
	    }).
	    error(function (data, status, headers, config) {
	      	console.log('error');
	    	localStorageService.saveOneNote(note);
	      	notesFunc(note);
	    });
}