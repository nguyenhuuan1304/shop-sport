import { userService } from "../services/index.js";

async function getUserById(req, res) {
  try {
    const user_id = req.user.user_id;
    const result = await userService.getUserById(user_id);
    if (result) {
      return res.status(200).json(result);
    } else return res.status(404).json({ message: "not found user!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const user_id = req.user.user_id;
    const user = req.body;
    if (!Object.keys(user).length) {
      return res
        .status(400)
        .json({ message: "You must provide some update data!" });
    }

    const updated_user = await userService.updateUser(user_id, user);

    if (updated_user) {
      return res.status(200).json({ message: "updated user successfully!" });
    } else return res.status(404).json({ message: "not found product" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getUserById, updateUser };
