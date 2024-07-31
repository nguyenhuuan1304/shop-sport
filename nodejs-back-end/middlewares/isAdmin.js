import { userService } from "../services/index";

async function isAdmin(req, res, next) {
  try {
    // Kiểm tra xem req.user và req.user.user_id có tồn tại không
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Lấy thông tin người dùng từ database
    const user = await userService.getUserById(req.user.user_id);

    // Kiểm tra vai trò của người dùng
    if (user && user.role === "ADMIN") {
      return next();
    } else {
      return res.status(403).json({ message: "Not allowed!" });
    }
  } catch (error) {
    // Xử lý lỗi khi gọi userService.getUserById
    return res.status(500).json({ message: error.message });
  }
}

export { isAdmin };
