// import mysql package
//configure mysql

let notes = [
    {
        id: 1, 
        content: "some note content",
        title: "My first note",
        user_id: "auth 0 user id"
    }
]

function getNotesForUser(userId, callback) {
    // SELECT * 
    // FROM notes 
    // WHERE user_id = userId;

    callback(null, notes)
}
exports.getNotesForUser = getNotesForUser