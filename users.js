const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');

router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })

  User.addUser(newUser, (err, User) => {
    if (err) {
      res.json({ success: false, msg: "Failed to Register User" });
    } else {
      res.json({ success: true, msg: "User registered" });
    }
  })
});

router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User Not found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1week
        });
        res.json({
          success: true,
          token: 'JWT' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        res.json({ success: false, msg: "Wrong Password" });
      }
    });
  });
});

router.get("/profile", (req, res, next) => {
  res.send("PROFILE");
});

// router.get("/validate", (req, res, next) => {
//   res.send("VALIDATE");
// });

module.exports = router;