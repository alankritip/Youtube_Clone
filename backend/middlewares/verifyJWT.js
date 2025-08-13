import jwt from 'jsonwebtoken';

/**
 * Validates JWT in Authorization header: "Bearer <token>"
 */
export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};
