const dotenv= require('dotenv');
dotenv.config();
const express= require('express');
const cors= require('cors');
const https= require('https');
const fs= require('fs');
const path= require('path');
const { Server } = require('socket.io');
const jwt= require('jsonwebtoken');
const { JWT_KEY } = require('./accounts/auth.js');
const { routes } = require('./router/routes.js');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.88.182:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+2.pem')),
}

app.get('/', (request, response)=> {
    // console.log(request);
    const resBody= {
        message: "Hello"
    };
    response.json(resBody);
});

app.get('/hello', (request, response)=> {
    // console.log(request);
    // response.send('Hello');
    const resBody= {
        // req: request,
        message: "Hello"
    };
    response.json(resBody);
    // response.send('Hello');
});

routes.get.forEach(route=> {
    if (route.middleware) app.get(route.path, route.middleware, route.function);
    else app.get(route.path, route.function);
});

routes.post.forEach(route=> {
    if (route.middleware) {
        app.post(route.path, route.middleware, route.function);
    } else {
        app.post(route.path, route.function);
    }
});

routes.delete.forEach(route=> {
    if (route.middleware) {
        app.delete(route.path, route.middleware, route.function);
    } else {
        app.delete(route.path, route.function);
    }
});

const PORT= process.env.SERVER_PORT;
// app.listen(PORT, ()=> {
//     console.log(
//         "Server is running at http://localhost:" + PORT,
//         " (local)\n                     http://192.168.88.161:" + PORT, " (network)"
//     );
// });

const server= https.createServer(httpsOptions, app);

const io= new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.88.182:3000"],
        methods: ['GET', 'POST'],
        // credentials: true
    }
});

const connectedUsers= [];
io.use((socket, next)=> {
    const accessToken= socket.handshake.auth.accessToken;
    let foundUser;
    jwt.verify(accessToken, JWT_KEY, (err, user)=> {
        if (err) {
            console.error("Token is not valid");
            return;
        }
        // console.log("user: ", user, "err: ", err);
        foundUser= user;
        return user;
    });
    // console.log("FOUND: ", foundUser);
    if (!foundUser) {
        console.error("NO user found!");
        return next(new Error("No user found"));
    }
    // console.log("TOKEN IS VALID BRO", foundUser);
    if (connectedUsers.find(user=> user.id=== foundUser.id))
    connectedUsers.push({
        id: foundUser.id,
        name: foundUser.username,
    });
    next();
});


io.on('connection', (socket)=> {
    // console.log(connectedUsers);
    // console.log("USER " + socket.id + " CONNECTED===============");
    // console.log("USER " + socket.handshake.auth.token + " CONNECTED===============");
    const creadentials= socket.handshake.auth;
    console.log("CONNECT=====>");
    console.log(creadentials);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(
        "🚀 HTTPS server running at https://localhost:" + PORT,
        "\n   or https://127.0.0.1:" + PORT
    );
});