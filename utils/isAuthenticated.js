const isAuthenticated = (req,res,next) => {
   if(req.user)
      return next();
   else
      return res.status(401).send({
         error: 'User is not authenticated'
      })
}

export default isAuthenticated;