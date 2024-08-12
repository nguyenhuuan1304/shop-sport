class ChangePasswordDTO {
  constructor(currentPassword, newPassword, confirmNewPassword) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }

  validate() {
    const errors = [];

    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmNewPassword
    ) {
      errors.push("Please fill in all fields.");
    }

    if (this.newPassword !== this.confirmNewPassword) {
      errors.push("New passwords do not match.");
    }

    if (this.newPassword?.length < 6 || this.confirmNewPassword?.length < 6) {
      errors.push("Password should be at least six characters.");
    }

    return errors;
  }
}

export default ChangePasswordDTO;
