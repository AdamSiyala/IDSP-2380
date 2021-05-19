const database = require('../database/database');

function createNote(note_title, note_body, callback) {
	const query = `
	INSERT INTO note (note_title, note_body)
	VALUES (?, ?)
	`;
  
	const params = [note_title, note_body];
  
	database.query(query, params, (error, result) => {
	  if (error) {
		callback(error)
		return
	  }
      console.log(results)
	  callback(null, result.insertId)
	})
  }

  
  function getNotes(callback) {
	const query = `
	SELECT * FROM note
	`
  
	database.query(query, (error, results) => {
	  if (error) {
		callback(error, null);
		return
	  }
      console.log(results);
	  callback(null, results)
	})
  }

  module.exports = {
      createNote,
      getNotes
  }