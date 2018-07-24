const requireUser = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

const requireAnom = (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    res.redirect('/books');
  }
};

module.exports = {
  requireUser,
  requireAnom
};
