const roles = {
  USER: "USER",
  ADMIN: "ADMIN",
};

module.exports = function (roleToCheck, options = {}) {
  return function (req, res, next) {
    const user = req.user;
    const rolesHierarchy = Object.keys(roles);

    if (req.body && options.securedFields) {
      const securedFieldsFound = Object.keys(req.body).filter((field) =>
        options.securedFields.includes(field)
      );
      if (securedFieldsFound.length) {
        if (!user) return res.sendStatus(403);
        console.log("SecuredFields found: " + securedFieldsFound.join(", "));
        if (
          rolesHierarchy.indexOf(user.role) >=
          rolesHierarchy.indexOf(roleToCheck)
        ) {
          console.log("SecuredFields: user has role");
          return next();
        } else {
          console.log("SecuredFields: user doens't have role");
          return res.sendStatus(403);
        }
      } else {
        if (options.anonymous) return next();
        return user ? next() : res.sendStatus(403);
      }
    }
    if (options.anonymous) return next();
    if (!user) return res.sendStatus(403);
    // If no securedFields, check globally the user role
    if (
      rolesHierarchy.indexOf(user.role) >= rolesHierarchy.indexOf(roleToCheck)
    ) {
      console.log("Global: user has role");
      next();
    } else {
      console.log("Global: user doesn't have role");
      res.sendStatus(403);
    }
  };
};

module.exports.ROLES = roles;
