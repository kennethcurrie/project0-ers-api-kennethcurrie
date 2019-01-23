import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';

export const port: number = 8080;
const app = express();
app.use('/', express.static(__dirname + '/public/'));

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// middleware

// routers
app.use('/', authRouter);
app.use('/users', userRouter);

app.listen(port);
console.log(`application started on port: ${port}`);