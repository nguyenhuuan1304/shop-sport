import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function generateToken(user_id) {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Unauthorized: Missing Authorization Header",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Missing Token",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Forbidden: Invalid token",
      });
    }
    req.user = decoded;
    console.log(req.user);
    next();
  });
}

export { generateToken, verifyToken };
