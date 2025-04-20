const { addUser, listUsers, findUserByName, deleteUser, findUserById } = require('./user-query');
const dotenv= require('dotenv');
dotenv.config();
const express= require('express');
const jwt= require('jsonwebtoken');
const { login } = require('./auth');
const cors= require('cors');

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

const PORT= process.env.SERVER_PORT;
app.listen(PORT, ()=> {
    console.log("Server is running at http://localhost:" + PORT, " (local)\n                     http://192.168.88.182:" + PORT, " (network)");
});