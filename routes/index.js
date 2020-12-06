const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const url = require('url')
const fs = require('fs')

/* GET home page. */
router.get('/', (req, res) => {
  if (process.env.MODE === 'vastavik') setCookies(res)
  res.render('index', { title: 'Welcome', url: parseUrl(req) })
})

router.get('/location', (req, res) => {
  res.render('pages/location', { title: 'Location', url: parseUrl(req) })
})
router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login', url: parseUrl(req) })
})
router.post('/home', (req, res) => {
  const username = req.body.username ? req.body.username : ''
  res.render('pages/home', { title: 'Home', url: parseUrl(req), username: username })
})
router.get('/home', (req, res) => {
  res.render('pages/home', { title: 'Home', url: parseUrl(req), username: '' })
})

router.get('/:category/:name', (req, res, next) => {
  if (hasAccess(`views/pages/${req.params.category}s/${req.params.name}`)) {
    next(createError(404))
  } else {
    const reqHeaders = req.headers
    const serverFingerprint = req.fingerprint
    const requestCookies = req.cookies
    const data = {
      title: req.params.name,
      url: parseUrl(req),
      requestHeaders: reqHeaders,
      requestFingerprint: serverFingerprint,
      requestCookies: requestCookies
    }
    res.render(`pages/${req.params.category}s/${req.params.name}/`, data)
  }
})

function setCookies (res) {
  const now = new Date().getTime()
  const maxAge = 2 * 60 * 60 * 1000
  res.cookie('serverCookie', now, { maxAge: maxAge })
  res.cookie('serverCookieHttpOnly', now, { httpOnly: true, maxAge: maxAge })
  res.cookie('serverCookieSameSite', now, { sameSite: 'strict', maxAge: maxAge })
  res.cookie('serverCookieSecure', now, { secure: true, maxAge: maxAge })
}

function hasAccess (path) {
  fs.access(path, (err) => { return !err })
}

function parseUrl (req) {
  // eslint-disable-next-line node/no-deprecated-api
  return url.parse(req.protocol + '://' + req.get('host') + req.originalUrl, true)
}

module.exports = router
