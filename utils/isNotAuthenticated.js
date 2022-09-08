const isNotAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated())
      return next();
   else
      return res.status(401).send({
         error: 'User is authenticated'
      })
}

export default isNotAuthenticated;