import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { useChangePasswordMutation } from "../../../../app/services/userApi";
import toast from "react-hot-toast";
import styles from "./ProfileSecurity.module.css";

function ProfileSecurity() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = "Please enter your old password";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (!formData.newPassword) {
      newErrors.newPassword = "Please enter a new password";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Password change error:", error);
      if (error?.status === 400 || error?.status === 401) {
        setErrors({ oldPassword: "Old password didn't match. Please check again." });
      } else {
        toast.error(
          error?.data?.message || "An unexpected error occurred while updating the password"
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Security Settings</h2>
        <p>Keep your account secure by regularly updating your password.</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Old Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <KeyRound size={16} /> Old Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your old password"
                className={`${styles.input} ${errors.oldPassword ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility("old")}
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && <span className={styles.errorText}>{errors.oldPassword}</span>}
          </div>
          

          {/* New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <ShieldCheck size={16} /> New Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <span className={styles.errorText}>{errors.newPassword}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <ShieldCheck size={16} /> Confirm New Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className={styles.spinner} size={20} />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSecurity;
