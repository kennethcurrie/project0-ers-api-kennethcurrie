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

// menus -  contains links not unique to user types
const associateMenu = [
  ['Reimbursements', '/reimbursements']
];
const financeMenu = [
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users']
];
const adminMenu = [
  ['Reimbursements', '/reimbursements'],
  ['Users', '/users']
];

export const authRouter = express.Router();

// response from login form
authRouter.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'admin',
      id: 1
    };
    req.session.user = user;
  } else if (req.body.username === 'finance-manager' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'finance-manager',
      id: 2
    };
    req.session.user = user;
  } else if (req.body.username === 'associate' && req.body.password === 'password') {
    const user = {
      username: req.body.username,
      role: 'associate',
      id: 3
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
    res.status(200).send(pageGenerator(loginPage, '', ''));
  } else {
    res.status(200).send(pageGenerator(homePage, req.session.user.role, req.session.user.id));
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

// create page body using template
export function pageGenerator(vars, type, id) {
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
  `;
  switch (type) {
    case 'admin':
      html += menuGenerator(adminMenu, id);
      break;
    case 'finance-manager':
      html += menuGenerator(financeMenu, id);
      break;
    case 'associate':
      html += menuGenerator(associateMenu, id);
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

// create page menu based on user role
function menuGenerator(items, id) {
  let menu = ``;
  menu += `<li><a href="/">Home</a></li>`;
  items.forEach(element => {
    menu += `<li><a href="${element[1]}">${element[0]}</a></li>`;
  });
  if (id !== '') {
    menu += `<li><a href="/users/${id}">Profile</a></li>`;
    menu += `<li><a href="/logout">Logout</a></li>`;
  }
  return menu;
}