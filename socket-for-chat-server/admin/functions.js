const { findUserById, deleteUser, addUser, listUsers } = require("./user-query");

function getUser(req, res){
    const user= findUserById(req.params.id);

    console.log(user);

    !user ? res.status(404).json({
        status: 'not found',
        data: {message: 'User not found'}
    }) : res.json({
        status: 'success',
        data: {user: {
            id: user.id,
            name: user.name,
            role: user.role,
        }}
    });
};

function deleteUserById (req, res) {
    const result= deleteUser(req.params.id);
    result.changes > 0
        ? res.json({ status: 'success', message: 'User deleted successfully' })
        : res.status(404).json({ status: "failed", error: 'User not found' });
};

function createNewUser (req, res) {
    // console.log(req);
    const userName= req.body.username;
    const pass= req.body.password;
    if (!userName || !pass) {
        res.status(400).json({
            error: 'Name and password are required'
        });
    } else {
        try {
            const result= addUser(userName, pass);
            res.json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(400).json({error: error, message: "Failed to create user, username already exists"})
        }
    }
};

function createProfile (req, res) {
    const {name, firstname, age, id}= req.body;
    try{
        res.json({
            result: addNewProfile(id, name, firstname, age)
        }); 
    } catch (error) {
        res.json({
            error: error
        });
    }
};

function getUsers (req, res) {
    res.json({
        status: 'success',
        data: listUsers().map(u=> ({
            id: u.id,
            name: u.name,
            role: u.role,
        }))
    });
};

module.exports= {getUser, deleteUserById, createNewUser, createProfile, getUsers};