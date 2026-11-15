// Intentionally vulnerable sample for code scanning. Do not deploy.
const express = require('express');
const { exec } = require('child_process');
const _ = require('lodash');

const app = express();

// Reflected XSS: user input is written into HTML without encoding
app.get('/hello', (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

// Command injection: user input is passed to a shell command
app.get('/list', (req, res) => {
  exec('ls ' + req.query.dir, (err, stdout) => {
    res.type('text/plain').send(err ? 'error' : stdout);
  });
});

app.get('/merge', (req, res) => {
  res.json(_.merge({}, JSON.parse(req.query.obj || '{}')));
});

app.listen(3000);
