const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const _ = require('lodash');

let env = process.env.NODE_ENV || 'development';

console.log(`env ***** ${env}`);

if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT;
let app = express();

app.use(bodyParser.json());      // middleware to fetch json data from body of POST

app.post('/todos', (req, res) => {
  console.log(req.body);

  let todoSample = new Todo({
    text:req.body.text
  });

  todoSample.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {

  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  Todo.findById(req.params.id).then((todo) => {
    if(!todo){                          // means there is no todo
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  }).catch((e) => console.log(e));
});

app.delete('/todos/:id', (req, res) => {

  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    if(!todo){                          // means there is no todo
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  });

});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;

  let body = _.pick(req.body, ['text', 'completed']);   // making sure that user does not update anything other than text and completed

  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed  = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {

    if(!todo){                          // means todo does not exist
      return res.status(404).send();
    }

    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/users/:id', (req, res) => {
  console.log(`req.params.id : ${req.params.id}`);

  if(!ObjectID.isValid(req.params.id)) {
    return res.send('Id not valid');
  }

  User.findById(req.params.id).then((user) => {
    if(!user){
      return res.status(404).send('Id not found');
    }
    res.send({user});
  }, (e) => {
    res.status(400).send(e);
  }).catch((e) => console.log(e));
});

app.listen(port, (req, res) => {
  console.log(`server is up and running on port ${port}!`);
});

module.exports = {app};
