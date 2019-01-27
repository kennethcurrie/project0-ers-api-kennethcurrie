import { unauthorizedError } from '../middleware/error.middleware';

export function authAdminMiddleware(req, res, next) {
  const role = req.session.user.role.role;
  if (role === undefined) {
     unauthorizedError(req, res);
  } else if (role === 'Admin') {
    next();
  } else {
    unauthorizedError(req, res);
  }
}

export function authFinanceMiddleware(req, res, next) {
  const role = req.session.user.role.role;
  if (role === undefined) {
     unauthorizedError(req, res);
  } else if (role === 'Finance-Manager') {
    next();
  } else {
    unauthorizedError(req, res);
  }
}

export function authAdminFinanceMiddleware(req, res, next) {
  const role = req.session.user.role.role;
  if (role === undefined) {
     unauthorizedError(req, res);
  } else if (role === 'Finance-Manager' || role === 'Admin') {
    next();
  } else {
    unauthorizedError(req, res);
  }
}