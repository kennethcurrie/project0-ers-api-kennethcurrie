import { pageGenerator } from '../routers/auth.router';

// static pages
const notFoundPage = ['404: Not Found', `<p>404: Page not Found</p>`];
const unauthorizedErrorPage = ['401: Unauthorized', `<p>401: Unauthorized</p>`];
const internalErrorPage = ['500: Internal Server Error', `<p>500: Internal Server Error</p>`];


export function notFound(req, res) {
  if (req.session === undefined || req.session.user === undefined || req.session.user.role === undefined) {
    res.status(404).send(pageGenerator(notFoundPage, ''));
  } else {
    res.status(404).send(pageGenerator(notFoundPage, req.session.user.role));
  }
}
export function internalError(req, res) {
  if (req.session === undefined || req.session.user === undefined ||  req.session.user.role === undefined) {
    res.status(404).send(pageGenerator(notFoundPage, ''));
  } else {
    res.status(404).send(pageGenerator(notFoundPage, req.session.user.role));
  }
}
export function unauthorizedError(req, res) {
  if (req.session === undefined || req.session.user === undefined ||  req.session.user.role === undefined) {
    res.status(401).send(pageGenerator(unauthorizedErrorPage, ''));
  } else {
    res.status(401).send(pageGenerator(unauthorizedErrorPage, req.session.user.role));
  }
}