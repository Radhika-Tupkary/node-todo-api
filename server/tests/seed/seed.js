const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

const usersArray = [
  {
  email:'penny@example.com',
  password: 'abhd123',
  _id: userOneId,
  tokens:[{
    token: jwt.sign({_id:userOneId, access: 'auth'}, 'pqr987').toString(),
    access: 'auth'
    }]
  },{
    email:'gen@example.com',
    password: 'poiu123',
    _id: userTwoId
  }
];

const todoArray = [{
  text:'First test todo',
  _id:new ObjectID()
  },{
  _id:new ObjectID(),
  text: 'Second test todo',
  completed:true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todoArray);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let user1 = new User(usersArray[0]).save();
    let user2 = new User(usersArray[1]).save();

    return Promise.all([user1, user2]);
  }).then(() => done());
};

module.exports = {usersArray, todoArray, populateTodos, populateUsers};
