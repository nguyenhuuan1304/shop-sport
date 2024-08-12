class RegisterDTO {
  constructor(
    username,
    email,
    password,
    number_phone,
    first_name,
    last_name,
    address,
    dob
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.number_phone = number_phone;
    this.first_name = first_name;
    this.last_name = last_name;
    this.address = address;
    this.dob = dob;
  }

  validate() {
    const errors = [];

    if (!this.username || this.username.length < 3) {
      errors.push("Username must be at least 3 characters.");
    }

    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
      errors.push("Invalid email address.");
    }

    if (!this.password || this.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    return errors;
  }
}

export default RegisterDTO;
