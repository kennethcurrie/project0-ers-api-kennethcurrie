import { unauthorizedError } from '../middleware/error.middleware';

export function authMiddleware(req, res, next) {
  const user = req.session.user;
  if (req.session === undefined || user === undefined || user.role === undefined) {
     unauthorizedError(req, res);
  } else if (user && user.role === 'admin') {
    next();
  } else {
    unauthorizedError(req, res);
  }
}