const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json('Authorization header missing');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json('Token missing');

    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    req.email = decoded.userMail || decoded.email;

    if (!req.email) return res.status(401).json('Email not found in token payload');

    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return res.status(401).json('Invalid or expired token');
  }
};

module.exports = jwtMiddleware;
