/// <reference path="../model/Category.ts" />
/// <reference path="../model/Note.ts" />

class LocalStorageProvider{
	private key: string;

	constructor(key: string){
		this.key = key;
	}

	saveAllNotes(notes: Note[]){

		var newarr = [];
		var unique = {};
		 
		for(var i = 0 ; i < notes.length; i++) {
			var item = notes[i];
		    if (!unique[item.createdDate]) {
		        newarr.push(item);
		        unique[item.createdDate] = item;
		    }
		}

	  	localStorage[this.key] = JSON.stringify(newarr);
	}

	getAllNotes(){
	  	var list = [];
	  	try{
	     	list = JSON.parse(localStorage[this.key]);
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
			    list[i].isModified,
			    list[i].isDeleted
		  	);
		  	listNotes.push( newItem );
		}

	  	return listNotes;
	}

	saveOneNote(note: Note){
  		var listOfNotes = this.getAllNotes();
  		listOfNotes.push(note);
  		this.saveAllNotes(listOfNotes);
	}

	updateOneNote(note: Note){
  		var listOfNotes = this.getAllNotes();
  		for(var i : number = 0; i < listOfNotes.length; i++){
    		if(listOfNotes[i].equals(note)){
    			listOfNotes[i].copyNote(note);
    		}
  		}

  		this.saveAllNotes(listOfNotes);
	}

	deleteOneNote(note: Note){
  		var listOfNotes = this.getAllNotes();
  		for(var i : number = 0; i < listOfNotes.length; i++){
    		if(listOfNotes[i].equals(note)){
    			listOfNotes.splice(i,1);
    			break;
    		}
  		}

  		this.saveAllNotes(listOfNotes);
	}

	mergeRecords(newNotes: Note[]){
  		var list = this.getAllNotes();

	  	for(var i = 0; i < newNotes.length; i++){
	    	var selectedItem = _.find(list, function(item){ return item.equals(newNotes[i]); } );

	    	if(selectedItem == null){
	      		var newItem = new Note(newNotes[i].name,
		        	newNotes[i].comment,
		        	newNotes[i].createdDate,
		        	newNotes[i].modifiedDate,
		        	newNotes[i].category,
		        	newNotes[i].id,
		        	newNotes[i].isModified,
	      			newNotes[i].isDeleted
      			);
	      		list.push( newItem );
	    	}
	    	else if(moment(selectedItem.modifiedDate).isBefore(newNotes[i].modifiedDate)){
		      	var index = list.indexOf(selectedItem);
		      	list[index].copyNote(newNotes[i]);
			}
		}

  		this.saveAllNotes(list);    
	}
}