import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // The token is sent in the Authorisation header as: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // attach the decoded user info to the request
    next();             // allow the request to continue to the route handler
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

export default authenticateToken;