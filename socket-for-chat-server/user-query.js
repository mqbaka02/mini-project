const sqlite= require('node:sqlite');
const bcrypt= require('bcrypt');
const { addNewProfile } = require('./profile-query');

const db= new sqlite.DatabaseSync('database.sqlite');

/**
 * Adds an user. Only the name and the password need to be specified since id is autoincremented.
 * @param {string} name 
 * @param {string} password
 */
function addUser(name, password) {
    const hashedPass= bcrypt.hashSync(password, 10);
    const query= db.prepare("INSERT INTO users (name, password) VALUES (?, ?)");
    const data= query.run(name, hashedPass);
    try{
        addNewProfile(data.lastInsertRowid);
    } catch (error) {
        return {...data, ["profileError"]: error};
    }
    return data;
};

/**
 * Searchs user by name.
 * @param {string} searchString
 * @returns {Object|undefined}
 */
function findUserByName(searchString) {
    const query= db.prepare("SELECT * from users WHERE name= ?");
     return query.get(searchString);
};

/**
 * Searchs user by id.
 * @param {number} searchString
 * @returns {Object|undefined}
 */
function findUserById(searchString) {
    const query= db.prepare("SELECT * from users WHERE id= ?");
     return query.get(searchString);
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
 * Deletes the user that corresponds to the given id.
 * @param {string} number
 */
function deleteUser(id) {
    const query= db.prepare('DELETE FROM users WHERE id=' + id);
    return query.run();
};

/**
 * Gets the role of an user based on the id.
 * @param {number} id 
 * @returns {string}
 */
function getUserRole(id){
    const query= db.prepare('SELECT role FROM users WHERE id=' + id);
    return query.all();
}

module.exports= {addUser, findUserByName, findUserById, listUsers, deleteUser, getUserRole};