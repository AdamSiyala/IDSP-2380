var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});
router.get('/dashboard', requiresAuth(), function (req, res, next) {
  res.render('dashboard', {
    title: 'Dashboard page'
  });
});
router.get('/note', requiresAuth(), function (req, res, next) {
  res.render('note', {
    title: 'Note page'
  });
});

module.exports = router;
