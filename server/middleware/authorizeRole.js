function authorizeRole(roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.sendStatus(401); // Not authenticated
    }
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403); // Not authorized
    }
    next();
  };
}

module.exports = authorizeRole;
