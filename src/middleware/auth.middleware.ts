export function authMiddleware(req, res, next) {
  const user = req.session.user;
  if (user && user.role === 'admin') {
    next();
  } else {
    res.sendStatus(401);
  }
}