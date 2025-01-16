const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token){
    //redirect to the login page
    res.redirect('/user/login');
    // return res.status(401).json({ msg: "Unauthorized Please login to access this page" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Unathoraized Please Login" });
  }
}

module.exports = auth;
