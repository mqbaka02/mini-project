const sqlite= require('node:sqlite');
const { addUser, listUsers, findUserByName, deleteUser } = require('./user-query');

const db = new sqlite.DatabaseSync('database.sqlite');

// db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
// db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');

// const inserter= db.prepare(`INSERT INTO users (name) VALUES ('thirdtUser')`);
// inserter.all();

// addUser('mqbaka');

// console.log(listUsers());
// deleteUser(5);

console.log(findUserByName('mqbaka'));
console.log(findUserByName('tom'));
console.log(listUsers());

db.close();