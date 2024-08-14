// import { userModel } from "../models/index.js";
// import bcrypt from "bcryptjs";
// import { generateToken } from "../middlewares/jwt.js";

// async function login(email, password) {
//   const user = await userModel.findOne({ email });

//   if (!user) {
//     throw new Error(
//       `Email address ${email} does not exist. Please check and try again.`
//     );
//   }
//   if (!bcrypt.compareSync(password, user.password)) {
//     throw new Error("Wrong password. Please check and try again.");
//   }

//   const token = generateToken(user._id);
//   return {
//     jwt: token,
//     user: {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       number_phone: user.number_phone,
//       address: user.address,
//       dob: user.dob,
//       role: user.role,
//     },
//   };
// }

// async function register(userData) {
//   const existed_user = await userModel.findOne({ email: userData.email });

//   if (existed_user) {
//     throw new Error("Your email address already exists");
//   }

//   const hashedPassword = await bcrypt.hash(userData.password, 10);
//   const new_user = {
//     ...userData,
//     password: hashedPassword,
//   };

//   await userModel.create(new_user);
//   return new_user;
// }

// async function changePassword(
//   user_id,
//   currentPassword,
//   newPassword,
//   confirmNewPassword
// ) {
//   let errors = [];

//   if (!currentPassword || !newPassword || !confirmNewPassword) {
//     errors.push("Please fill in all fields.");
//   }

//   if (newPassword !== confirmNewPassword) {
//     errors.push("New passwords do not match.");
//   }

//   if (newPassword.length < 6) {
//     errors.push("Password should be at least six characters.");
//   }

//   if (errors.length > 0) {
//     throw new Error(errors.join(" "));
//   }

//   const user = await userModel.findById(user_id);

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   const isMatch = await bcrypt.compare(currentPassword, user.password);

//   if (!isMatch) {
//     throw new Error("Current password is not a match.");
//   }

//   const hash = await bcrypt.hash(newPassword, 10);
//   user.password = hash;
//   await user.save();

//   return "Password successfully updated!";
// }

// export { login, register, changePassword };
