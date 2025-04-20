const { findUserByName } = require("./user-query");
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const dotenv= require('dotenv');
dotenv.config();
const JWT_KEY= process.env.JWT_SECRET_KEY;

/**
 * What do you want, it is the function used for login, it's litterally in its name !
 * @param {any} req The request
 * @param {any} res The response
 * @returns {any}
 */
const login= (req, res) => {
    const {username, password}= req.body;

    const user= findUserByName(username);

    if(!user || ! bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({error: "Invalid credentials", message: "User name or password is incorrect"});
    }
    
    const accessToken= jwt.sign({id: user.id, username: user.name}, JWT_KEY, {expiresIn: '1h'});
    const refreshToken= jwt.sign({id: user.id}, JWT_KEY, {expiresIn: '7d'});

    res.json({success: true, data:{ accessToken, refreshToken}});
};

module.exports= {login};