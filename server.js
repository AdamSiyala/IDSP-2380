const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');

const database = require('./database')

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

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


  // Save notes to database 
const s3 = require('./s3')

app.use(express.static('build'))

app.get('/notes/:filename', (req, res) => {
  const filename = req.params.filename
  const readStream = s3.getFileStream(filename)
  readStream.pipe(res)
})

app.get('/notes', (req, res) => {
  database.getNote((error, posts) => {
    if (error) {
      res.send({ error: error.message })
      return
    }
    res.send({ notes })
  })

})

app.post('/notes', upload.single('note'), async (req, res) => {
  const { filename, path } = req.file
  const note_body = req.body.note_body

  await s3.uploadFile(req.file)

  const note_body = `/notes/${filename}`
  database.createNote(note_title, note_body, (error, insertId) => {
    if (error) {
      res.send({error: error.message})
      return
    }
    res.send({
      note_id: insertId,
      note_title,
      note_body
    })
  })

