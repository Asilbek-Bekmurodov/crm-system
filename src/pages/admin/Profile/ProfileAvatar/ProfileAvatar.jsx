import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import toast from "react-hot-toast";
import { useUploadProfilePictureMutation } from "../../../../app/services/userApi";
import { Check } from "lucide-react";
import styles from "./ProfileAvatar.module.css";

function ProfileAvatar() {
  const [preview, setPreview] = useState(null);
  const [uploadProfilePicture, { isLoading }] =
    useUploadProfilePictureMutation();

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSave = async () => {
    if (!preview) return;
    const toastId = toast.loading("Rasm saqlanmoqda...");

    try {
      const imageBlob = dataURLtoBlob(preview);
      const file = new File([imageBlob], "profile.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      await uploadProfilePicture(formData).unwrap();
      toast.success("Profil rasmi muvaffaqiyatli yangilandi!", {
        id: toastId,
        style: {
          borderRadius: "10px",
          background: "#10b981",
          color: "#fff",
        },
      });
    } catch (err) {
      toast.error("Xatolik: " + (err.data?.message || "Rasm yuklanmadi"), {
        id: toastId,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Profil rasmi</h2>
        <p className={styles.subtitle}>Yangi rasm yuklang va tahrirlang</p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <Avatar
            width={300}
            height={300}
            onCrop={(v) => setPreview(v)}
            onClose={() => setPreview(null)}
            label="Rasm tanlang"
            labelStyle={{ color: "#718096", cursor: "pointer" }}
            backgroundColor="#f7fafc"
          />
        </div>

        {preview && (
          <div className={`${styles.card} ${styles.previewCard}`}>
            <h3 className={styles.cardTitle}>Natija</h3>
            <div className={styles.avatarPreview}>
              <img src={preview} alt="Preview" />
            </div>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <Check size={18} /> Saqlash
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAvatar;
