const sqlite = require("node:sqlite");

const db= new sqlite.DatabaseSync('database.sqlite');

/**
 * Inserts a new profile in the profiles table
 * @param {number} id 
 * @param {string|null} name 
 * @param {string|null} firstname 
 * @param {number|null} age 
 * @returns {any}
 */
function addNewProfile (id, name= null, firstname= null, age= null){
    const query= db.prepare("INSERT INTO profiles (userID, name, firstname, age) VALUES (?, ?, ?, ?)");
    try{
        return query.run(id, name, firstname, age);
    } catch (error) {
        console.log(error);
        return error;
    }
}

/**
 * Finds the corresponding profile to the given ID.
 * @param {number} id The user ID which corresponds to the primary key of the users table
 * @returns {any}
 */
function getProfile(id) {
    const query= db.prepare("SELECT * FROM profiles WHERE userid= ?");
    return query.get(id);
}

/**
 * Returns a list of all the profiles
 * @returns {Array}
 */
function getAllProfiles() {
    const query= db.prepare("SELECT * FROM profiles");
    return query.all();
}

/**
 * Changes the record corresponding to id
 * @param {number} id 
 * @param {string|null} name 
 * @param {string|null} firstname 
 * @param {number|null} age 
 * @returns {any}
 */
function updateProfile(id, name, firstname, age) {
    const query= db.prepare("UPDATE profiles SET name= ?, firstname= ?, age= ? WHERE userID= ?");
    return query.run(name, firstname, age, id);
}

module.exports= {addNewProfile, getProfile, getAllProfiles, updateProfile};