import { ROLES } from "./constants";

const isAdmin = (req,res,next) => {
    if(req.user.role == ROLES.Admin)
       return next();
    else
       return res.status(401).json({
         error: 'User is not admin'
       })
}

export default isAdmin;