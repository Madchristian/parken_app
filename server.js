const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const uuid = require('uuid').v4;
const session = require('express-session');

// EJS als Template-Engine einrichten
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statische Dateien aus dem 'public'-Ordner bedienen
app.use(express.static(path.join(__dirname, 'public')));

// express-session Middleware hinzufügen
app.use(session({
  secret: uuid(),
  resave: false,
  saveUninitialized: true
}));

// Eine Route fuer die Homepage einrichten
app.get('/', (req, res) => {
  res.render('index'); // index.ejs im Views ordner wird gerendert
});
app.get('/parkplatz', function(req, res) {
  res.render('parkplatz');
});
app.get('/parken', function(req, res) {
  res.render('parken');
});

app.get('/erlauben', (req, res) => {
  req.session.erlaubnis = true;
  res.send('Erlaubnis erteilt');
});
// Starten Sie den Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
