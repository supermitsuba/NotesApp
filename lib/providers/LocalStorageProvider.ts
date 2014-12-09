/// <reference path="../model/Category.ts" />
/// <reference path="../model/Note.ts" />

class LocalStorageProvider{
	private key: string;

	constructor(key: string){
		this.key = key;
	}

	saveAllNotes(notes: Note[]){
	  localStorage[this.key] = JSON.stringify(notes);
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
  		var item = _.find(listOfNotes, function(i) {return i.id = note.id;});
  		var index = listOfNotes.indexOf(item);
  		if(index > -1){
    		listOfNotes[index] = note;
  		}

  		this.saveAllNotes(listOfNotes);
	}

	deleteOneNote(note: Note){
  		var listOfNotes = this.getAllNotes();
  		var index = listOfNotes.indexOf(note);
  		if(index > -1){
    		listOfNotes.splice(index,1);
  		}

  		this.saveAllNotes(listOfNotes);
	}

	mergeRecords(newNotes: Note[]){
  		var list = this.getAllNotes();

	  	for(var i = 0; i < newNotes.length; i++){
	    	var selectedItem = _.find(list, function(item){ return item.id == newNotes[i].id && item.id != -1; } );

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
		      	list[index].name = newNotes[i].name;
		      	list[index].comment = newNotes[i].comment;
		      	list[index].modifiedDate = newNotes[i].modifiedDate;
		      	list[index].category = newNotes[i].category;
		      	list[index].isModified = newNotes[i].isModified;
		      	list[index].isDeleted = newNotes[i].isDeleted;
		      
			}
		}

  		this.saveAllNotes(list);    
	}
}