const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const pg = require('pg');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    post: 5432,
    user: 'postgres',
    password: 'a1b2c3d4',
    database: 'test'
  }
});

const postPerPage = 10;

const server = express();
const port = process.env.PORT || 5000;

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
    console.log('new post');
    const postId = crypto.randomBytes(20).toString('hex');
    knex.insert({
      id: postId,
      create_time: Date.now(),
      title: req.body.title,
      content: req.body.content,
      raw_content: req.body.rawContent,
    }).then((result) => {
      console.log(result);
    }).catch(err => console.error(err));
  } else {
    console.log('haha');
  }
  res.sendStatus(200);
});

server.get('/api/post/:pageNo', (req, res) => {
  console.log(req.params.pageNo);
  knex.select('title', 'create_time').from('test').where('delete_time', 'is', null).limit((req.params.pageNo + 1) * postPerPage).offset(req.params.pageNo * postPerPage)
  .then((result) => {
    console.log(result);
    res.send(JSON.stringify({}));
  });
})


server.listen(port, () => {
  console.log('%s listening on %s', server.name, port);
});
