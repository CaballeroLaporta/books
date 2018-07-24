const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('auth/signup', { message: 'Los campos no pueden estar vacios' });
  User.findOne({ username })
    .then(user => {
      // user existe
      if (user) {
        return res.render('auth/signup', { message: 'Este username no disponible' });
      } else {
        // user no existe
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        return newUser.save();
      }
    })
    .then(user => {
      req.session.currentUser = user;
      res.redirect('/books');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('auth/login', { message: 'No vacio plis!!!' });
  User.findOne({ username })
    .then(user => {
      if (!user) return res.render('auth/login', { message: 'user o password incorrecto' });
      if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.redirect('/auth/login');
      }
    });
});

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
