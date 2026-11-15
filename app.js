// Sample for code scanning (fixed version).
const express = require('express');
const { execFile } = require('child_process');
const rateLimit = require('express-rate-limit');
const _ = require('lodash');

const app = express();
app.use(rateLimit({ windowMs: 60 * 1000, limit: 60 }));

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Fixed: encode user input before writing it into HTML
app.get('/hello', (req, res) => {
  res.send('<h1>Hello ' + escapeHtml(req.query.name) + '</h1>');
});

// Fixed: no shell, and only allow-listed directories
const allowedDirs = ['public', 'logs'];
app.get('/list', (req, res) => {
  const dir = allowedDirs.includes(req.query.dir) ? req.query.dir : 'public';
  execFile('ls', ['--', dir], (err, stdout) => {
    res.type('text/plain').send(err ? 'error' : stdout);
  });
});

app.get('/merge', (req, res) => {
  res.json(_.merge({}, JSON.parse(req.query.obj || '{}')));
});

app.listen(3000);

// New route (intentionally vulnerable again for the pull request check)
app.get('/greet', (req, res) => {
  res.send('<p>Welcome, ' + req.query.user + '</p>');
});
