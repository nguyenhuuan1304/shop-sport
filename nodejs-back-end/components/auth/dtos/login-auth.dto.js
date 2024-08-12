class LoginDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  validate() {
    const errors = [];

    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
      errors.push("Invalid email address.");
    }

    if (!this.password || this.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    return errors;
  }
}

export default LoginDTO;
