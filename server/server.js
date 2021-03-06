require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const pg = require('pg');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    post: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
  }
});

const postPerPage = 10;

const server = express();
const port = process.env.PORT || 5000;

const escapeChar = text => new Promise((res, rej) => {
  const find = ['&', '<', '>', '\\(', '\\)', '"', '\'', '/'];
  const replace = ['&amp;', '&lt;', '&gt;', '&#28;', '&#29;', '&quot;', '&#x27;', '&#x2F;'];
  let escaped = text;
  try {
    for (let i = 0; i < find.length; i += 1) {
      const regex = new RegExp(find[i], 'g');
      escaped = escaped.replace(regex, replace[i]);
    }
    res(escaped);
  } catch (err) {
    rej(err);
  }
});

server.use('/', express.static('public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.post('/api/post', (req, res) => {
  if (req.body.postId === undefined) {
    const postId = crypto.randomBytes(20).toString('hex');
    knex('posts')
      .insert({
        id: postId,
        create_time: Date.now(),
        title: req.body.title,
        content: req.body.content,
        raw_content: req.body.rawContent,
      })
      .then((result) => {
        res.sendStatus(200);
      })
      .catch(err => console.error(err));
    /*
    let escapedContent = '';
    escapeChar(req.body.content)
    .then((result) => {
      escapedContent = result;
      return escapeChar(req.body.title);
    }).then((res) => {
      return knex('posts').insert({
        id: postId,
        create_time: Date.now(),
        title: res,
        content: escapedContent,
        raw_content: req.body.rawContent,
      })
    }).then((result) => {
      console.log(result);
      res.sendStatus(200);
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
    */
  } else {
    knex('posts')
      .update({
        update_time: Date.now(),
        title: req.body.title,
        content: req.body.content,
        raw_content: req.body.rawContent,
      })
      .where('id', '=', req.body.postId)
      .then((result) => {
        res.sendStatus(200);
      })
      .catch(err => console.error(err));
  }
});

server.get('/api/page/:pageNo', (req, res) => 
  knex
    .select('id', 'title', 'create_time')
    .from('posts')
    .where('delete_time', 'is', null)
    .orderBy('create_time', 'desc')
    .limit((req.params.pageNo + 1) * postPerPage)
    .offset(req.params.pageNo * postPerPage)
    .then((result) => {
      res.send(JSON.stringify({ posts: result, next: result.length === postPerPage }));
    })
);

server.get('/api/post/:postId', (req, res) =>      // single post
  knex
    .select('title', 'create_time', 'content')
    .from('posts')
    .where('id', '=', req.params.postId)
    .then((result) => {
      if (result.length === 0) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(result[0]);
    })
);

server.get('/api/raw-post/:postId', (req, res) => 
  knex.select('title', 'raw_content').from('posts').where('id', '=', req.params.postId)
    .then((result) => {
      if (result.length === 0) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(result[0]);
    })
);

server.post('/api/delete', (req, res) => {
  knex('posts')
    .update({
      delete_time: Date.now(),
    })
    .where('id', '=', req.body.postId)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch(err => console.error(err));
});

server.get('*', function (req, res) {
  res.sendfile('./public/index.html');
});


server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
