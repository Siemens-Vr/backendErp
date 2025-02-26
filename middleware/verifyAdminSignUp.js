import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  if (!req.cookies) {
    req.userId = null; // Allow request to proceed even if no cookies
    return next();
  }

  const token = req.cookies.token;
  
  if (!token) {
    req.userId = null; // Allow execution to continue
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (error) {
    console.error("Error in verifyToken:", error);
    req.userId = null; // Continue without stopping execution
  }

  next();
};
