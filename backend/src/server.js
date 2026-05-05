require("dotenv").config();
const express = require("express");
const prisma = require('./config/prisma')
const routes = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler");
const http = require("http")

const { initSocket } = require("./config/socket")

const app = express();
const server = http.createServer(app)

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

// init socket
initSocket(server)

//config req.body
app.use(express.json()); // đọc JSON
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorHandler);


(async() => {
    try {
        await prisma.$connect();
        console.log("DB connected")

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`);
        })
    } catch (error) {
        console.log("Error connect to DB", error)
    }
})()