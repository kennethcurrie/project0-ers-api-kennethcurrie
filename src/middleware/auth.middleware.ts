import { unauthorizedError } from '../middleware/error.middleware';

export function authMiddleware(req, res, next) {
  const user = req.session.user;
  if (req.session === undefined || user === undefined || user.role === undefined) {
     unauthorizedError(req, res);
  } else if (req.session.user.role === 'admin' || req.session.user.role === 'finance') {
    next();
  } else {
    unauthorizedError(req, res);
  }
}