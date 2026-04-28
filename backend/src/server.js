require("dotenv").config();
const express = require("express");
const prisma = require('./config/prisma')
const routes = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler");


const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config req.body
app.use(express.json()); // đọc JSON
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("public/uploads"))

app.use('/api', routes);

app.use(errorHandler);


(async() => {
    try {
        await prisma.$connect();
        console.log("DB connected")

        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`);
        })
    } catch (error) {
        console.log("Error connect to DB", error)
    }
})()