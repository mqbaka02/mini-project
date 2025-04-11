const sqlite= require('node:sqlite');

const db= new sqlite.DatabaseSync('database.sqlite');
/**
 * Adds an user. Only the name needs to be specified since id is autoincremented.
 * @param {string} name 
 */
function addUser(name) {
    const query= db.prepare("INSERT INTO users (name) VALUES ('" + name + "')");
    query.all();
};

/**
 * Searchs user by name.
 * @param {string} searchString
 * @returns {Array}
 */
function findUserByName(searchString) {
    const query= db.prepare("SELECT * from users WHERE name= '" + searchString + "'");
     return query.all();
};

/**
 * Searchs user by id.
 * @param {number} searchString
 * @returns {Array}
 */
function findUserById(searchString) {
    const query= db.prepare("SELECT * from users WHERE id= '" + searchString + "'");
     return query.all();
};

/**
 * Returns a ist of all users.
 * @returns {Array}
 */
function listUsers() {
    const query= db.prepare('SELECT * FROM users');
    return(query.all());
};

/**
 * Deetes the user that corresponds to the given id.
 * @param {string} number
 */
function deleteUser(id) {
    const query= db.prepare('DELETE FROM users WHERE id=' + id);
    query.all();
};

module.exports= {addUser, findUserByName, findUserById, listUsers, deleteUser};