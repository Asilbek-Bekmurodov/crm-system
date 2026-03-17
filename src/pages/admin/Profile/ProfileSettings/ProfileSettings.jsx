import React from "react";
import { useOutletContext } from "react-router-dom";
import { Check } from "lucide-react";
import styles from "./ProfileSettings.module.css";

function ProfileSettings() {
  const { user } = useOutletContext(); 

  return (
    <>
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
            <input placeholder="Masalan: Fullstack Developer" />
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
            </select>
          </div>
          <div className={styles.group}>
            <label>Veb-sayt</label>
            <input placeholder="https://example.com" />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button className={styles.saveBtn}>
            <Check size={18} /> Saqlash
          </button>
        </div>
      </section>
    </>
  );
}

export default ProfileSettings;
