import { verifyToken, generateToken } from "../middlewares/jwt.js";
import { userModel } from "../models/index.js";
import bcrypt from "bcryptjs";
import { userService } from "../services/index.js";

async function login(req, res) {
  try {
    const user = await userModel.findOne({ email: req.body.email });

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
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        first_name: user?.first_name,
        last_name: user?.last_name,
        number_phone: user?.number_phone,
        address: user?.address,
        dob: user?.dob,
        role: user?.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

async function register(req, res) {
  try {
    const existed_user = await userModel.findOne({ email: req.body.email });
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
      address: req.body.address,
      dob: req.body.dob,
    };
    await userService.addUser(new_user);
    return res
      .status(200)
      .json({ message: "Register successfully", user: new_user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user_id = req.user.user_id;
    let errors = [];
    // Check required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      errors.push({ msg: "Please fill in all fields." });
    }

    // Check passwords match
    if (newPassword !== confirmNewPassword) {
      errors.push({ msg: "New passwords do not match." });
    }

    // Check password length
    if (newPassword?.length < 6 || confirmNewPassword?.length < 6) {
      errors.push({ msg: "Password should be at least six characters." });
    }

    if (errors?.length > 0) {
      return res.status(404).json({ errors: errors });
    }

    // VALIDATION PASSED
    // Ensure current password submitted matches
    const user = await userModel.findById(user_id);

    if (!user) {
      errors.push({ msg: "User not found." });
      return res.status(404).json({ errors: errors });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      errors.push({ msg: "Current password is not a match." });
      return res.status(404).json({ errors: errors });
    }

    // Encrypt newly submitted password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    // req.flash("success_msg", "Password successfully updated!");
    return res.status(200).json({ message: "Password successfully updated!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { login, register, changePassword };
