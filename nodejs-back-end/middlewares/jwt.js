import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function generateToken(user_id) {
  return {
    access_token: generateAccessToken(user_id),
    refresh_token: generateRefreshToken(user_id),
  };
  // return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
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

// function verifyToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Access token required" });

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//     if (err) {
//       // Token hết hạn, kiểm tra refresh token
//       const refreshToken = req.cookies?.refresh_token;
//       if (!refreshToken)
//         return res.status(401).json({ message: "Refresh token required" });

//       jwt.verify(
//         refreshToken,
//         process.env.JWT_SECRET_KEY,
//         (err, refreshUser) => {
//           if (err)
//             return res.status(403).json({ message: "Invalid refresh token" });

//           // Tạo và gửi lại access token mới
//           const newToken = generateToken(refreshUser.user_id);
//           res.cookie("refresh_token", newToken.refresh_token, {
//             httpOnly: true,
//             sameSite: "Strict",
//           });
//           req.user = refreshUser;
//           next();
//         }
//       );
//     } else {
//       req.user = user;
//       next();
//     }
//   });
// }

// Generate access token
function generateAccessToken(user_id) {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}

// Generate refresh token
function generateRefreshToken(user_id) {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

export { generateToken, verifyToken };
