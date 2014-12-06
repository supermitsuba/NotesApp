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

	constructor(localStorageService:LocalStorageProvider, httpService:any){
		this.httpService = httpService;
		this.localStorageService = localStorageService;
	}

	syncNotes(notesFunc: SuccessfulNotesFunc){
		this.getAllNotes(notesFunc);
	}

	getAllNotes(notesFunc: SuccessfulNotesFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.get('/api/notes').
		    success(function (data) {
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

	getCategories(){
		var list: string[] = [];
		for (var enumMember in Category) {
		   list.push(enumMember);
		}
  		return list;
	}

	deleteNote(note:Note, notesFunc:SuccessfulNotesFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.delete('/api/notes/'+note.id).
		    success(function (data, status, headers, config) {
		      	localStorageService.deleteOneNote(note);
		      	if(notesFunc){
		      		notesFunc(localStorageService.getAllNotes());
		      	}
		    }).
		    error(function (data, status, headers, config) {
		    	console.log('error');
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
		return new Note('', '', new Date(), new Date(), Category.None, "-1", true, false);
	}

	updateOneNote(note:Note, notesFunc:SuccessfulNoteFunc){
		var localStorageService:LocalStorageProvider = this.localStorageService;

		this.httpService.put('/api/notes', { note: note }).
		    success(function (data, status, headers, config) {
		    	note.isModified = false;
		    	localStorageService.updateOneNote(note);
		       	if(notesFunc){
		      		notesFunc(note);
		      	}
		    }).
		    error(function (data, status, headers, config) {
		      	console.log('error');
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
}