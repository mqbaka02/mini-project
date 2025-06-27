const { findUserByName, getUserRole } = require("./user-query");
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

    let adminToken;
    // console.log(getUserRole(user.id)[0].role);
    const isAdmin= (getUserRole(user.id)[0]?.role=== 'admin');
    
    const accessToken= jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '1h'});
    if (isAdmin){
        adminToken= jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '1h'});
    }
    const refreshToken= jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '7d'});
    // console.log(user);

    res.json({success: true, data:{
        refreshToken: refreshToken,
        accessToken: accessToken,
        id: user.id,
        ...(isAdmin && {adminToken: adminToken})
    }});
};

/**
 * Checks the validity of a token.
 * @param {any} req 
 * @param {any} res 
 * @returns {any}
 */
const checkToken= (req, res) => {
    const token= req.body.token;

    jwt.verify(token, JWT_KEY, (err, user)=> {
        if (err) {
            return res.status(403).json({error: err, message: "This token is not valid."});
        }
        return res.json({success: true, message: "Token is valid alrgiht.", user: user});
    });
};

module.exports= {login, checkToken, JWT_KEY};