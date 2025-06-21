const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./model/db");
const AuthRouter = require("./Router/AuthRouter");
const TaskRouter = require("./Router/TaskRouter");

require("dotenv").config({ path: path.join(__dirname, '..', '.env') });
const port = process.env.PORT;
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, 
};

app.use(cors(corsOptions));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use("/auth", AuthRouter);
app.use("/task", TaskRouter);

