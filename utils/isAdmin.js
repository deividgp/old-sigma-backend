import { ROLES } from "./constants.js";

const isAdmin = (req, res, next) => {
   if (req.user.role == ROLES.Admin)
      return next();
   else
      return res.status(401).send({
         error: 'User is not admin'
      })
}

export default isAdmin;