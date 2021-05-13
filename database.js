const mysql = require('mysql');

const is_heroku = process.env.IS_HEROKU || false;

var connection = mysql.createConnection({
	host     : process.env.MYSQL_HOST || 'us-cdbr-east-03.cleardb.com',
	user     : process.env.MYSQL_USER || 'b1ab7fb2ee03bc',
	password : process.env.MYSQL_PASSWORD || 'fb13ec28',
	database : process.env.MYSQL_DATABASE || 'heroku_03c6ca63989ce29'
  })
   
  connection.connect()
  
  function createNote(note_title, note_body, callback) {
	const query = `
	INSERT INTO note (note_title, note_body)
	VALUES (?, ?)
	`
  
	const params = [note_title, note_body]
  
	connection.query(query, params, (error, result) => {
	  if (error) {
		callback(error)
		return
	  }
	  callback(null, result.insertId)
	})
  }
  exports.createNote = createNote
  
  function getNote(callback) {
	const query = `
	SELECT * FROM note
	`
  
	connection.query(query, (error, results) => {
	  if (error) {
		callback(error)
		return
	  }
	  callback(null, results)
	})
  }
  exports.getNote = getNote

		