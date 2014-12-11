/// <reference path="../model/Category.ts" />
/// <reference path="../model/Note.ts" />
/// <reference path="../providers/LocalStorageProvider.ts" />
interface SuccessfulNotesFunc {
  ( notes: Note[]): void;
}

interface SuccessfulNoteFunc {
  ( notes: Note): void;
}

class NoteProvider{
	private httpService: any;
	private localStorageService:LocalStorageProvider;
	private promise: any;

	constructor(localStorageService:LocalStorageProvider, httpService:any, promise:any){
		this.httpService = httpService;
		this.localStorageService = localStorageService;
		this.promise = promise;
	}

	syncNotes(notesFunc: SuccessfulNotesFunc){

		var localStorageService:LocalStorageProvider = this.localStorageService;
		var localNotes: Note[] = localStorageService.getAllNotes();
		     	
     	var failedBunch = [];
     	var urlCalls = [];

		//var deferred = this.promise.defer();

		for(var i : number = 0; i < localNotes.length; i++){
			var note = localNotes[i];

			if(note.id == '-1' && note.isDeleted == false && note.isModified){
				urlCalls.push(this.httpService.post('/api/notes', { note: note }));
			}
			else if(note.id != '-1' && note.isDeleted == false && note.isModified){
				urlCalls.push(this.httpService.put('/api/notes', { note: note }));
			}
			else if(note.id != '-1' && note.isModified){
				urlCalls.push(this.httpService.delete('/api/notes/'+note.id));
			}
		}

		var func = notesFunc;
		var http:any = this.httpService;

		this.promise.all(urlCalls)
          .then(
            function(results) {
             http.get('/api/notes', { cache:false, timeout:200 }).
             	success(function (data, status, headers, config) {
             		localStorageService.saveAllNotes(data);
             		func(localStorageService.getAllNotes());
             	})
             	.error(function (data, status, headers, config) {
		      	console.log('Get All Notes - Error');
		      	if(notesFunc){
					notesFunc(localStorageService.getAllNotes());
				}
		    });
          },
          function(errors) {
          		func(localStorageService.getAllNotes());
          },
          function(updates) {

          });		
	}

	getAllNotes(notesFunc: SuccessfulNotesFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.get('/api/notes').
		    success(function (data) {
		      	console.log('Get All Notes - Success');
		       	if(notesFunc){
		      		notesFunc(localStorageService.getAllNotes());
		      	}
		    }).
		    error(function (data, status, headers, config) {
		      	console.log('Get All Notes - Error');
		      	if(notesFunc){
					notesFunc(localStorageService.getAllNotes());
				}
		    });
	}

	getCategories(){
  		return Category;
	}

	deleteNote(note:Note, notesFunc:SuccessfulNotesFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.delete('/api/notes/'+note.id).
		    success(function (data, status, headers, config) {
		    	console.log('Delete Note - Success');
		      	localStorageService.deleteOneNote(note);
		      	if(notesFunc){
		      		notesFunc(localStorageService.getAllNotes());
		      	}
		    }).
		    error(function (data, status, headers, config) {
		    	console.log('Delete Note - Error');
		    	if(note.id == "-1"){
		    		localStorageService.deleteOneNote(note);
		    		if(notesFunc){
			      		notesFunc(localStorageService.getAllNotes());
			      	}
		    	}
		    	else{
			    	note.isDeleted = true;
			    	note.isModified = true;
			    	note.modifiedDate = new Date();
			    	localStorageService.updateOneNote(note);
			    	if(notesFunc){
			      		notesFunc(localStorageService.getAllNotes());
			      	}
		      	}
		    }); 
	}

	newNote(){
		return new Note('', '', new Date(), new Date(), '', "-1", true, false);
	}

	updateOneNote(note:Note, notesFunc:SuccessfulNoteFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.put('/api/notes', { note: note }).
		    success(function (data, status, headers, config) {
		    	console.log('Update Note - Success');
		    	note.isModified = false;
		    	localStorageService.updateOneNote(note);
		       	if(notesFunc){
		      		notesFunc(note);
		      	}
		    }).
		    error(function (data, status, headers, config) {
		      	console.log('Update Note - Error');
		    	localStorageService.updateOneNote(note);
		       	if(notesFunc){
		      		notesFunc(note);
		      	}
		    });
	}

	saveOneNote(note:Note, notesFunc:SuccessfulNoteFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.post('/api/notes', { note: note }).
		    success(function (data, status, headers, config) {
		    	console.log('Save Note - Success');
		    	note.id = data.id;
		    	note.isModified = false;
		    	localStorageService.saveOneNote(note);
		       	if(notesFunc){
		      		notesFunc(note);
		      	}
		    }).
		    error(function (data, status, headers, config) {
		      	console.log('Save Note - Error');
		    	localStorageService.saveOneNote(note);
		       	if(notesFunc){
		      		notesFunc(note);
		      	}
		    });
	}
}