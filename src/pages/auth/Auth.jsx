import { useState } from "react";
import styles from "./Auth.module.css";
import { useLoginMutation } from "../../app/services/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredential } from "../../app/features/authSlice";
import { useNavigate } from "react-router-dom";

function Auth() {
  // local state - ma'lumot faqatgina bir komponentani o'zida shlatilsa yoki vaqtinchalik
  const [formData, setFormData] = useState({
    username: "superadmin",
    password: "superadmin123",
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let res = await login(formData).unwrap();

      dispatch(
        setCredential({
          token: res.accessToken,
          role: res.role,
        }),
      );
      if (res.role === "SUPER_ADMIN") {
        navigate("/super-admin");
      }

      toast.success("Xush kelibsiz !");
    } catch (e) {
      console.log(e);
      toast.error("Nimadur xato ketdi !");
    }
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Welcome Back</h2>

        <div className={styles.inputGroup}>
          <input
            onChange={handleChange}
            value={formData.username}
            name="username"
            type="text"
            placeholder="Username"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            onChange={handleChange}
            value={formData.password}
            name="password"
            type="password"
            placeholder="Password"
            className={styles.input}
            required
          />
        </div>

        <button className={styles.button}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
