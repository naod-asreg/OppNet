import jwt from "jsonwebtoken"
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'ilias', (err, decoded) => {
    if (err) {
      console.log("invalid token")
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // Attach user information to the request object
      req.user = decoded;
      next(); // Call next() here once verification is successful
    }
  });
};

export {verifyToken}