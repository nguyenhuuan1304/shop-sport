import { verifyToken, generateToken } from "../middlewares/jwt.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { userService } from "../services/index.js";

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message:
          "Email address " +
          req.body.email +
          " is not exit. Please check and try again.",
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res
        .status(401)
        .json({ message: "Wrong password. Please check and try again." });
    }
    //login successfull
    const token = generateToken(user._id);

    return res.status(200).json({
      jwt: token,
      user: {
        username: user?.username,
        email: user?.email,
        firstName: user?.firstname,
        lastName: user?.last_name,
        role: user?.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

async function register(req, res) {
  try {
    const existed_user = await User.findOne({ email: req.body.email });
    if (existed_user) {
      return res.status(400).json({
        message: "Your email address is already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const new_user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      number_phone: req.body.number_phone,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    await userService.addUser(new_user);
    return res
      .status(200)
      .json({ message: "Register successfully", user: new_user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { login, register };
