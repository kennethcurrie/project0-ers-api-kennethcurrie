import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { notFound, internalError } from './middleware/error.middleware';

export const port: number = 8080;
const methodOverride = require('method-override');
const app = express();
app.use('/', express.static(__dirname + '/public/'));

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// change method to patch when needed.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// create logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  next(); // will pass the request on to search for the next piece of middleware
});


// set up express to attach sessions
const sess = {
  secret: '8675309',
  cookie: { secure: false },
  resave: false,
  saveUnitialized: false
};

// create session
app.use(session(sess));

// routers
app.use('/', authRouter);
app.use('/users', userRouter);
// error middleware
app.use(function(req, res) {
   notFound(req, res);
});
app.use(function(error, req, res, next) {
  internalError(req, res);
});

app.listen(port);
console.log(`application started on port: ${port}`);