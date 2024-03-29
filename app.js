const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require("./config/database");

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log("connected to database " + config.database);
})

mongoose.connection.on('error', (err) => {
  console.log('DataBase error : ' + err);
})

const app = express();

const users = require("./routes/users");

const port = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, "public")));

app.use("/users", users);

app.get("/", (req, res) => {
  res.send('Invalid Endpoint');
})

app.listen(port, () => {
  console.log("server started on Port " + port);
})