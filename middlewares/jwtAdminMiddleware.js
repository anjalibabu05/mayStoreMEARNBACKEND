const jwt = require('jsonwebtoken');

const jwtAdminMiddleware = (req, res, next) => {
  console.log('Inside Admin JWT middleware');

  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json('Token not found');
    }

    const jwtResponse = jwt.verify(token, 'secretKey');
    console.log('Decoded token:', jwtResponse);

    if (jwtResponse.userMail === 'adminbook@gmail.com') {
      next();
    } else {
      res.status(401).json('Invalid user');
    }
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json('Invalid token');
  }
};

module.exports = jwtAdminMiddleware;
