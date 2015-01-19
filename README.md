NotesApp
========

An app to organize notes.  The cool part is that this organizes notes between devices for you.  If you are offline, then the app will store the data in local storage, until it can detect a connection.  How it syncs up is be 3 different syncing methods.  If you ADD a note, it will just create the item.  If you delete it before it has been sent to the server, then nothing will be persisted.  If you UPDATED a record, then it will override the values, if it has a higher datetime stamp.  Lastly if you delete a record, it will send a delete message to the server.  Once it has synced all of this on the server, then it flushes the local storage and gets a new set of notes from the server.  This keeps it simple, code wise.  Pretty fun project.

Uses on Client Side
===================
1.  Twitter bootstrap
2.  Angular.js
3.  Moment (for date/time parsing)
4.  Underscore
5.  Typescript
6.  LocalStorage

Uses on Server Side
===================
1.  Node.js
2.  Grunt
3.  Express 4.0
4.  NEDB
