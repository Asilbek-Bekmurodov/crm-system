import React, { useState } from "react";
import { Layout, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./public.module.css";
import robot from "../../assets/31772 1.svg";
import Galaxy from "./components/Galaxy/Galaxy";

function Public() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* GALAXY BACKGROUND - FULL SCREEN */}
      <div className={styles.galaxyWrapper}>
        <Galaxy
          density={0.6}
          starSpeed={0.02}
          speed={0.3} 
          rotationSpeed={0.05} 
          glowIntensity={0.2}
          twinkleIntensity={0.2} 
          hueShift={220}
          saturation={0.3} 
          transparent={true}
        />
      </div>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.nav}>
          <div className={styles.logo}>
            <div className={styles.logoBox}>
              <Layout size={22} color="white" />
            </div>
            CRM<span>SYSTEM</span>
          </div>

          <div className={`${styles.menu} ${isMenuOpen ? styles.open : ""}`}>
            <a href="#feature" onClick={() => setIsMenuOpen(false)}>
              Feature
            </a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              About
            </a>
            <a href="#blog" onClick={() => setIsMenuOpen(false)}>
              Blog
            </a>

            <button
              className={styles.loginBtn}
              style={{
                display: isMenuOpen ? "block" : "none",
                marginTop: "20px",
              }}
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/auth")}
            >
              Login
            </button>

            <button
              className={styles.hamburger}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className={styles.main}>
          <div>
            <h1 className={styles.title}>
              Get ready for the <br />
              <span>new era of AI</span>
            </h1>

            <p className={styles.subtitle}>
              O'quv markazingizni boshqarishda yangi texnologiyalarni qo'llang.
              Barcha jarayonlar bir joyda, aqlli va tezkor.
            </p>
          </div>

          <div className={styles.previewContainer}>
            <img src={robot} className={styles.robotImg} alt="AI Robot" />
          </div>
      </div>
    </div>
  );
}

export default Public;
