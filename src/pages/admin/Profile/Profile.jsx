import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../../app/services/userApi";
import {
  ArrowLeft,
  User,
  Shield,
  Image,
  CreditCard,
  Bell,
  Globe,
  LogOut,
  Check,
} from "lucide-react";
import styles from "./Profile.module.css";
import defaultImg from "../../../assets/photo_2025-12-18_20-15-58.jpg";

function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) return <div className={styles.loader}>Yuklanmoqda...</div>;

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.profileBox}>
          <div className={styles.avatarWrapper}>
            <img src={user?.profilePictureUrl || defaultImg} alt="profile" />
            <div className={styles.activeStatus}></div>
          </div>
          <h3>
            {user?.firstname} {user?.lastname}
          </h3>
          <p className={styles.userEmail}>{user?.username}</p>
        </div>

        <nav className={styles.navMenu}>
          <ul className={styles.menu}>
            <li className={`${styles.menuItem} ${styles.active}`}>
              <User size={18} /> Profil sozlamalari
            </li>
            <li className={styles.menuItem}>
              <Image size={18} /> Profil rasmi
            </li>
            <li className={styles.menuItem}>
              <Shield size={18} /> Xavfsizlik
            </li>
            <li className={styles.menuItem}>
              <CreditCard size={18} /> To'lovlar
            </li>
            <li className={styles.menuItem}>
              <Bell size={18} /> Bildirishnomalar
            </li>
          </ul>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutBtn}>
              <LogOut size={18} /> Chiqish
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.content}>
        {/* Ortga qaytish tepada alohida */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Ortga qaytish
          </button>
        </div>

        <div className={styles.header}>
          <h2>Shaxsiy ma'lumotlar</h2>
          <p>Profilingizni boshqaring va ma'lumotlarni yangilang</p>
        </div>

        <section className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.group}>
              <label>Ism</label>
              <input
                type="text"
                defaultValue={user?.firstname}
                placeholder="Ism"
              />
            </div>

            <div className={styles.group}>
              <label>Familiya</label>
              <input
                type="text"
                defaultValue={user?.lastname}
                placeholder="Familiya"
              />
            </div>

            <div className={`${styles.group} ${styles.fullWidth}`}>
              <label>Sarlavha (Headline)</label>
              <input type="text" placeholder="Masalan: Fullstack Developer" />
            </div>

            <div className={`${styles.group} ${styles.fullWidth}`}>
              <label>Biografiya</label>
              <textarea
                rows="4"
                placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
              />
            </div>

            <div className={styles.group}>
              <label>Til</label>
              <select>
                <option>O'zbekcha</option>
                <option>English</option>
                <option>Русский</option>
              </select>
            </div>

            <div className={styles.group}>
              <label>Veb-sayt</label>
              <input type="text" placeholder="https://example.com" />
            </div>
          </div>

          <div className={styles.formFooter}>
            <button className={styles.saveBtn}>
              <Check size={18} /> Saqlash
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
