const { addUser, listUsers, findUserByName, deleteUser, findUserById } = require('./user-query');
const dotenv= require('dotenv');
dotenv.config();
const express= require('express');
const jwt= require('jsonwebtoken');
const { login, checkToken, JWT_KEY } = require('./auth');
const cors= require('cors');
const { addNewProfile, getAllProfiles, getProfile, updateProfile } = require('./profile-query');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.88.182:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (request, response)=> {
    console.log(request);
    const resBody= {
        message: "Hello"
    };
    response.json(resBody);
});

app.get('/hello', (request, response)=> {
    console.log(request);
    // response.send('Hello');
    const resBody= {
        // req: request,
        message: "Hello"
    };
    response.json(resBody);
    // response.send('Hello');
});

app.get('/users', (req, res)=> {
    res.json({
        status: 'success',
        data: listUsers()
    });
});

app.get('/user/:id', (req, res)=>{
    const user= findUserById(req.params.id);

    user.length=== 0 ? res.status(404).json({
        status: 'not found',
        data: {message: 'User not found'}
    }) : res.json({
        status: 'success',
        data: {user: user[0]}
    });
});

app.post('/user/create', (req, res)=> {
    console.log(req);
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
});

app.delete('/user/:id', (req, res)=> {
    const result= deleteUser(req.params.id);
    result.changes > 0
        ? res.json({ status: 'success', message: 'User deleted successfully' })
        : res.status(404).json({ status: "failed", error: 'User not found' });
});

app.post('/login', login);
app.post('/check-token', checkToken);

/**
 * Middleware for token authentication for protected API routes.
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns {any}
 */
const authenticateToken= (req, res, next) => {
    if (req.headers['authorization']) {
        const accessToken= req.headers['authorization'].split(' ')[1];
        const refreshToken= req.headers['authorization'].split(' ')[2];
        if (!refreshToken) {
            return res.status(401).json({error: 'Access denied, one or more token is missing.'});
        }
        // next();

        jwt.verify(refreshToken, JWT_KEY, (err, user)=> {
            if (err) {
                return res.status(401).json({error: "refreshToken", message: "Refresh token is not valid."});
            }
            req.user= user;
            jwt.verify(accessToken, JWT_KEY, (err, user)=> {
                if(err ) {
                    return res.status(401).json({error: "accessToken", message: "Access token is expired"});
                }
                next();
            });
        });
    }
    // next();
};

app.post('/profile-info', authenticateToken, (req, res)=> {
    res.json({message: "Profile data", data: getProfile(req.body.id)});
});

app.post('/refresh', (req, res)=> {
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

        const newAccessToken= jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '1h'});
        const newRefreshToken= jwt.sign({id: user.id, username: user.name, userrole: user.role}, JWT_KEY, {expiresIn: '7d'});
        return res.json({success: true, refreshToken: newRefreshToken, accessToken: newAccessToken});
    });
});

app.post('/update-info', authenticateToken, (req, res)=> {
    const {id, name, firstname, age}= req.body;
    const result= updateProfile(id, name, firstname, age);
    if(result.changes=== 1){
        res.json({success: true, messsage: "Profile updated succesfully"});
    } else {
        res.status(500).json({success: false, message: "Operation failed."});
    }
});

// console.log(getAllProfiles());
// console.log(getProfile(1));
// updateProfile(1, "Henintsoa", null, null);

const PORT= process.env.SERVER_PORT;
app.listen(PORT, ()=> {
    console.log(
        "Server is running at http://localhost:" + PORT,
        " (local)\n                     http://192.168.88.161:" + PORT, " (network)"
    );
});