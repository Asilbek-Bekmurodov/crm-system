import { useState, useEffect } from "react";
import styles from "./CreateUserForm.module.css";
import {
  useCreateUserMutation,
  useEditUserMutation,
} from "../../../app/services/userApi";
import { toast } from "react-toastify";
// Ikonkalarni import qilamiz
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function CreateUserForm({ setIsOpen, editingUser }) {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    username: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  useEffect(() => {
    if (editingUser) {
      setUserData({
        ...editingUser,
        password: "",
      });
    }
  }, [editingUser]);

  function handleChange(e) {
    setUserData((state) => ({
      ...state,
      [e.target.name]:
        e.target.name === "age" ? Number(e.target.value) : e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingUser) {
        await editUser({ id: editingUser.id, data: userData }).unwrap();
        toast.success("Foydalanuvchi tahrirlandi!");
      } else {
        await createUser(userData).unwrap();
        toast.success("Muvaffaqiyatli yaratildi!");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* --- Firstname --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={userData.firstname}
          name="firstname"
          type="text"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Firstname</label>
      </div>

      {/* --- Lastname --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={userData.lastname}
          name="lastname"
          type="text"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Lastname</label>
      </div>

      {/* --- Username --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={userData.username}
          name="username"
          type="text"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Username</label>
      </div>

      <div className={styles.field}>
        <div
          className={styles.passwordWrapper}
          style={{ position: "relative" }}
        >
          <input
            onChange={handleChange}
            value={userData.password}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            className={styles.input}
            required
            style={{ width: "100%" }}
          />
          <label className={styles.label}>Password</label>

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              fontSize: "20px",
              color: "#666",
            }}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
      </div>

      {/* --- Age --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={userData.age}
          name="age"
          type="number"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Age</label>
      </div>

      {/* --- Role --- */}
      <div className={styles.field}>
        <select
          onChange={handleChange}
          value={userData.role}
          name="role"
          className={styles.select}
          required
        >
          <option value="" disabled hidden>
            Role tanlang
          </option>
          <option value="ADMIN">ADMIN</option>
          <option value="ADMINISTRATOR">ADMINISTRATOR</option>
          <option value="TEACHER">TEACHER</option>
          <option value="STUDENT">STUDENT</option>
        </select>
        <label className={styles.label}>Role</label>
      </div>

      {/* --- Gender --- */}
      <div className={styles.genderSection}>
        <strong>Gender:</strong>
        <div className={styles.radioGroup}>
          <input
            onChange={handleChange}
            type="radio"
            name="gender"
            value="MALE"
            checked={userData.gender === "MALE"}
            required
          />
          <label>Male</label>
        </div>
        <div className={styles.radioGroup}>
          <input
            onChange={handleChange}
            type="radio"
            name="gender"
            value="FEMALE"
            checked={userData.gender === "FEMALE"}
          />
          <label>Female</label>
        </div>
      </div>

      <button
        disabled={isCreating || isEditing}
        type="submit"
        className={styles.button}
      >
        {isCreating || isEditing
          ? "Saving..."
          : editingUser
            ? "Update"
            : "Create"}
      </button>
    </form>
  );
}

export default CreateUserForm;
