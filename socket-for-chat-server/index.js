const dotenv= require('dotenv');
dotenv.config();
const express= require('express');
const jwt= require('jsonwebtoken');
const cors= require('cors');
const https= require('https');
const fs= require('fs');
const path= require('path');
const { routes } = require('./certs/router/routes.js');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.88.182:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+3-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+3.pem')),
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

https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
    console.log(
        "🚀 HTTPS server running at https://localhost:" + PORT,
        "\n   or https://127.0.0.1:" + PORT
    );
});