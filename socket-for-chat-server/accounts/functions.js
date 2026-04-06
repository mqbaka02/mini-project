const { getUserRole } = require("../admin/user-query");
const { getProfile, updateProfile } = require("./profile-query");
const jwt= require('jsonwebtoken');

function profileInfo (req, res) {
    res.json({message: "Profile data", data: getProfile(req.body.id)});
};

function updateProfileInfo (req, res) {
    const {id, name, firstname, age}= req.body;
    const result= updateProfile(id, name, firstname, age);
    if(result.changes=== 1){
        res.json({success: true, messsage: "Profile updated succesfully"});
    } else {
        res.status(500).json({success: false, message: "Operation failed."});
    }
};

function refreshToken (req, res) {
    const {refreshToken}= req.body;
    if (!refreshToken) {
        return res.status(401).json({
            error: "refreshToken",
            message: "Refresh token is missing from request."
        });
    }
    jwt.verify(refreshToken, JWT_KEY, (err, user)=> {
        if(err) {
            return res.status(403).json({error: "refreshToken", message: "Refresh token is invalid."});
        }
        
        let adminToken;
        const isAdmin= (getUserRole(user.id)[0]?.role=== 'admin');

        const newAccessToken = jwt.sign({ id: user.id, username: user.name, userrole: user.role }, JWT_KEY, { expiresIn: '1h' });
        if (isAdmin) {
            adminToken = jwt.sign({ id: user.id, username: user.name, userrole: user.role }, JWT_KEY, { expiresIn: '1h' });
        }
        const newRefreshToken = jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '7d'});

        return res.json({
            success: true,
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            ...(isAdmin && {adminToken: adminToken})
        });
    });
};

module.exports= {profileInfo, updateProfileInfo, refreshToken};