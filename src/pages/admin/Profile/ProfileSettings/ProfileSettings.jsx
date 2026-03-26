import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Check,
  Loader2,
  User,
  Globe,
  FileText,
  AtSign,
  Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateMeMutation } from "../../../../app/services/userApi";
import styles from "./ProfileSettings.module.css";

function ProfileSettings() {
  const { user } = useOutletContext();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    headline: "",
    bio: "",
    language: "uz",
    website: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  // Sync form with user data when it loads
  useEffect(() => {
    if (user) {
      setForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        headline: user.headline || "",
        bio: user.bio || "",
        language: user.language || "uz",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMe({
        firstname: form.firstname,
        lastname: form.lastname,
        headline: form.headline,
        bio: form.bio,
        language: form.language,
        website: form.website,
      }).unwrap();

      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi! ✓");
      setIsDirty(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        err?.data?.message || "Saqlashda xatolik yuz berdi. Qayta urinib ko'ring."
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <User size={22} />
        </div>
        <div>
          <h2 className={styles.headerTitle}>Shaxsiy ma'lumotlar</h2>
          <p className={styles.headerSubtitle}>
            Profilingizni boshqaring va ma'lumotlarni yangilang
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Name Row */}
        <div className={styles.formGrid}>
          <div className={styles.group}>
            <label className={styles.label}>
              <User size={14} />
              Ism
            </label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="Ismingizni kiriting"
              className={styles.input}
            />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>
              <User size={14} />
              Familiya
            </label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Familiyangizni kiriting"
              className={styles.input}
            />
          </div>
        </div>

        {/* Username (read-only) */}
        <div className={styles.group}>
          <label className={styles.label}>
            <AtSign size={14} />
            Foydalanuvchi nomi
          </label>
          <div className={styles.readonlyWrapper}>
            <span className={styles.atSign}>@</span>
            <input
              type="text"
              value={user?.username || ""}
              readOnly
              className={`${styles.input} ${styles.readonlyInput}`}
            />
            <span className={styles.readonlyBadge}>O'zgartirib bo'lmaydi</span>
          </div>
        </div>

        {/* Headline */}
        <div className={styles.group}>
          <label className={styles.label}>
            <Briefcase size={14} />
            Sarlavha (Headline)
          </label>
          <input
            type="text"
            name="headline"
            value={form.headline}
            onChange={handleChange}
            placeholder="Masalan: Senior Fullstack Developer"
            className={styles.input}
          />
        </div>

        {/* Bio */}
        <div className={styles.group}>
          <label className={styles.label}>
            <FileText size={14} />
            Biografiya
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
            className={styles.textarea}
          />
          <span className={styles.charCount}>{form.bio.length}/300 belgi</span>
        </div>

        {/* Language + Website */}
        <div className={styles.formGrid}>
          <div className={styles.group}>
            <label className={styles.label}>
              <Globe size={14} />
              Til
            </label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="uz">🇺🇿 O'zbekcha</option>
              <option value="en">🇬🇧 English</option>
              <option value="ru">🇷🇺 Русский</option>
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>
              <Globe size={14} />
              Veb-sayt
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={styles.input}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.formFooter}>
          {isDirty && (
            <span className={styles.unsavedHint}>
              • Saqlanmagan o'zgarishlar mavjud
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className={styles.saveBtn}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spin} />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Check size={18} />
                Saqlash
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
