import { useState } from "react";
import styles from "./Auth.module.css";
import { useLoginMutation } from "../../app/services/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredential } from "../../app/features/authSlice";
import { useNavigate } from "react-router-dom";
import LiquidEther from "./components/LiquidEther/LiquidEther";
import { User, Lock, Eye, EyeOff, Loader2, Activity } from "lucide-react";

function Auth() {
  const [formData, setFormData] = useState({
    username: "superadmin",
    password: "superadmin123",
  });

  const [showPassword, setShowPassword] = useState(false);

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
      console.log(res);

      dispatch(
        setCredential({
          token: res.accessToken,
          role: res.role,
        }),
      );

      if (res.role === "SUPER_ADMIN") {
        navigate("/super-admin");
      }

      if (res.role === "TEACHER") {
        navigate("/teacher");
      }

      if (res.role === "ADMIN") {
        navigate("/admin");
      }
      if (res.role === "ADMINISTRATOR") {
        navigate("/administrator");
      }

      if (res.role === "STUDENT") {
        navigate("/student");
      }

      toast.success("Xush kelibsiz !");
    } catch (e) {
      console.log(e);
      toast.error("Nimadur xato ketdi !");
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Chap taraf */}
      <div className={styles.left}>
        <div className={styles.authCard}>
          <div className={styles.logoBox}>
            <div className={styles.logoWrapper}>
              <Activity size={24} strokeWidth={3} />
            </div>
            <span className={styles.logoText}>CRMSYSTEM</span>
          </div>

          <h2 className={styles.title}>Welcome Back</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username */}
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={20} />
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
            {/* Password */}
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                onChange={handleChange}
                value={formData.password}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Extra options */}
            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgotPass}>
                Forgot password?
              </a>
            </div>
            {/* Submit */}
            <button className={styles.loginBtn} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={24} />
              ) : (
                "Login"
              )}
            </button>
            {/* Back */}

            <div
              className={styles.backBtnWrapper}
              onClick={() => navigate("/")}
            >
              <div className={styles.lineLeft}></div>
              <button type="button" className={styles.backBtnText}>
                BACK
              </button>
              <div className={styles.lineRight}></div>
            </div>
          </form>
        </div>
      </div>

      {/* O‘ng taraf Liquid Effect */}
      <div className={styles.right}>
        <LiquidEther
          style={{ width: "100%", height: "100%" }}
          colors={["#82dbf7", "#b6f09c", "#5227FF"]}
          mouseForce={25}
          cursorSize={80}
          isViscous
          autoDemo
        />
      </div>
    </div>
  );
}

export default Auth;
