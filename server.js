const dotenv = require('dotenv');
dotenv.load();

const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');

const {createNote, getNotes} =  require('./service/noteService');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const port = process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `http://localhost:${port}`
};


if (process.env.NODE_ENV === 'production') {
  config.baseURL = process.env.BASE_URL
}
app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

app.get('/notes', async (req, res) => {

  getNotes((error, notes) => {
    if (error) {
      res.render("error", { message: error.message })
      return;
    }
    res.render("note", { notes });
    //res.send(notes);
  })
})

app.post('/notes', async (req, res) => {

  const note_body = req.body.note_body
  const note_title = req.body.note_title

  // const {note_body, note_title} = req.body;

  createNote(note_title, note_body, (error, result) => {
    if (error) {
      res.render("error", { message: error.message })
      return;
    }
    res.redirect("/dashboard");
  })
})

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});



http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
