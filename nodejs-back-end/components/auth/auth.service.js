import userModel from "../user/user.model.js";
import { addUser } from "../user/user.service.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/jwt.js";

async function loginService(loginDTO) {
  const validationErrors = loginDTO.validate();
  const { email, password } = loginDTO;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error(
      `Email address ${email} does not exist. Please check and try again.`
    );
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error("Wrong password. Please check and try again.");
  }

  const token = generateToken(user._id);
  return {
    jwt: token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      number_phone: user.number_phone,
      address: user.address,
      dob: user.dob,
      role: user.role,
    },
  };
}

async function registerService(registerDTO) {
  const {
    username,
    email,
    password,
    number_phone,
    first_name,
    last_name,
    address,
    dob,
  } = registerDTO;

  const existed_user = await userModel.findOne({ email });

  if (existed_user) {
    throw new Error("Your email address already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const new_user = {
    username,
    email,
    number_phone,
    first_name,
    last_name,
    address,
    dob,
    password: hashedPassword,
  };

  await addUser(new_user);
  return new_user;
}

async function changePasswordService(user_id, changePasswordDTO) {
  const { currentPassword, newPassword } = changePasswordDTO;

  const user = await userModel.findById(user_id);

  if (!user) {
    throw new Error("User not found.");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is not a match.");
  }

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();

  return "Password successfully updated!";
}

export { loginService, registerService, changePasswordService };
