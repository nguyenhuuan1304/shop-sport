import LoginDTO from "./dtos/login-auth.dto.js";
import RegisterDTO from "./dtos/register-auth.dto.js";
import ChangePasswordDTO from "./dtos/change-password-auth.dto.js";
import {
  loginService,
  registerService,
  changePasswordService,
} from "./auth.service.js";

async function loginController(req, res) {
  try {
    const loginDTO = new LoginDTO(req.body.email, req.body.password);
    const errors = loginDTO.validate();

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await loginService(loginDTO);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function registerController(req, res) {
  try {
    const registerDTO = new RegisterDTO(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.number_phone,
      req.body.first_name,
      req.body.last_name,
      req.body.address,
      req.body.dob
    );
    const errors = registerDTO.validate();

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newUser = await registerService(registerDTO);
    return res
      .status(200)
      .json({ message: "Register successfully", user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function changePasswordController(req, res) {
  try {
    const user_id = req.user.user_id;
    const changePasswordDTO = new ChangePasswordDTO(
      req.body.currentPassword,
      req.body.newPassword,
      req.body.confirmNewPassword
    );
    const errors = changePasswordDTO.validate();

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const message = await changePasswordService(user_id, changePasswordDTO);
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export { loginController, registerController, changePasswordController };
