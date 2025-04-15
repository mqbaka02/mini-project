const { addUser, listUsers, findUserByName, deleteUser, findUserById } = require('./user-query');
const dotenv= require('dotenv');
dotenv.config();
const express= require('express');

const app = express();

app.use(express.json());

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
    const userName= req.body.name;
    if (!userName) {
        res.status(400).json({
            error: 'Name is required'
        });
    } else {
        const result= addUser(userName);
        res.json({
            status: 'success',
            data: {newUserId: result}
        });
    }
});

app.delete('/user/:id', (req, res)=> {
    const result= deleteUser(req.params.id);
    result.changes > 0
        ? res.json({ status: 'success', message: 'User deleted successfully' })
        : res.status(404).json({ status: "failed", error: 'User not found' });
});

const PORT= process.env.SERVER_PORT;
app.listen(PORT, ()=> {
    console.log("Server is running at http://localhost:", PORT);
});