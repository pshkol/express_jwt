const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: false}))

function getToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (auth !== undefined) {
    const token = auth.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.redirect('error')
  }
}

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res) => {
  const tokenJSON = {
    username: req.body.username,
    password: req.body.password
  }
  console.log(req.body);
  const token = jwt.sign(tokenJSON, 'my_secret_code');
  res.json({token})
})

app.get('/error', (req, res) => {
  res.send('error');
})

app.get('/protected', getToken, (req, res) => {
  jwt.verify(req.token, 'my_secret_code', (err, data) => {
    if (err) {
      res.redirect('/error');
    } else {
      res.send(data)
    }
  })
})


app.listen(3000, () => {
  console.log('El servidor esta escuchando en el puerto 3000');
})
