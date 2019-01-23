import express from 'express';

// static pages
const loginPage = ['Login Page', `<p>Please login</p>
<div id="login">
<form method="post" action="/login">
<p>Username:<br/><input type="text" name="username" id="username"value=""></p>
<p>password<br/><input type="password" name="password" id="password" value="">
<p>&nbsp;</p>
<p><input type="submit" value="Login"></p>
</form>
</div>`];
const homePage = ['Home', `<p>Welcome</p>`];

// menus
const associateMenu = menuGenerator([
  ['Reimbursements', '/reimbursements'],
  ['Logout', '/logout']
]);
const financeMenu = menuGenerator([
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users'],
  ['Logout', '/logout']
]);
const adminMenu = menuGenerator([
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users'],
  ['Logout', '/logout']
]);

export const authRouter = express.Router();

// response from login form
authRouter.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'admin'
    };
    req.session.user = user;
  } else if (req.body.username === 'finance-manager' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'finance-manager'
    };
    req.session.user = user;
  } else if (req.body.username === 'associate' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'associate'
    };
    req.session.user = user;
  } else {
    console.log('login failed');
    res.sendStatus(401);
  }
  res.redirect('/');
});

// present login if not logged in
authRouter.get('/', (req, res) => {
  if (req.session.user === undefined) {
    res.status(200).send(pageGenerator(loginPage, ''));
  } else {
    res.status(200).send(pageGenerator(homePage, req.session.user.role));
  }
});

// redirect to home
authRouter.get('/login', (req, res) => {
  res.redirect('/');
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    // cannot access session here
  });
  res.redirect('/');
});

export function pageGenerator(vars, type) {
  const title = vars[0];
  const body = vars[1];
  let html = `<html>
  <head>
  <title>Project 0 App - ${title}</title>
  <link rel="stylesheet" type="text/css" href="/css/style.css">
  </head>
  <body>
  <div id="main">
  <nav>
  <ul id="menu" >
  <li><a href="/">Home</a></li>
  `;
  switch (type) {
    case 'admin':
      html += adminMenu;
      break;
    case 'finance-manager':
      html += financeMenu;
      break;
    case 'associate':
      html += associateMenu;
      break;
    default:
      break;
  }
  html += `</ul>
  </nav>
  <div id="primary">
  ${body}
  </div>
  <footer>Project 0<br/>Kenneth Currie</footer>
  </div>
  </body>
  </html>`;
  return html;
}

function menuGenerator(items) {
  let menu = ``;
  items.forEach(element => {
    menu += `<li><a href="${element[1]}">${element[0]}</a></li>`;
  });
  return menu;
}