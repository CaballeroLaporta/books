const express = require('express');
const router = express.Router();
const Book = require('../models/book');

/* GET books listing. */
router.get('/', (req, res, next) => {
  Book.find()
    .then(books => {
      res.render('books/list', { books });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/add', (req, res, next) => {
  res.render('books/add');
});

router.post('/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  Book.create({ title, author, description, rating })
    .then(() => {
      res.redirect('/books');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Book.findById(id)
    .then(book => {
      res.render('books/detail', book);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  Book.findById(id)
    .then(book => {
      res.render('books/edit', book);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, rating } = req.body;
  Book.findByIdAndUpdate(id, { title, author, description, rating })
    .then(data => {
      res.redirect(`/books/${id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Book.findByIdAndRemove(id)
    .then(data => {
      console.log('-> ', data);
      res.redirect('/books');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
