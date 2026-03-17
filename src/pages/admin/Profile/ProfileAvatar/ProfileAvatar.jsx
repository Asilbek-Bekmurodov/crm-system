import { useState } from "react";
import toast from "react-hot-toast";
import { useUploadProfilePictureMutation } from "../../../../app/services/userApi";
import { Check, Upload } from "lucide-react";
import styles from "./ProfileAvatar.module.css";

function ProfileAvatar() {
  const [preview, setPreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [uploadProfilePicture, { isLoading }] =
    useUploadProfilePictureMutation();

  const createImage = (file) =>
    new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(imageUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("Rasmni o'qib bo'lmadi"));
      };

      image.src = imageUrl;
    });

  const createCenteredSquarePreview = async (file) => {
    const image = await createImage(file);
    const size = Math.min(image.width, image.height);
    const startX = (image.width - size) / 2;
    const startY = (image.height - size) / 2;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 512;

    context.drawImage(
      image,
      startX,
      startY,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL("image/png");
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm faylini tanlang");
      return;
    }

    setIsPreparing(true);
    setSelectedFileName(file.name);

    try {
      const nextPreview = await createCenteredSquarePreview(file);
      setPreview(nextPreview);
    } catch {
      setPreview(null);
      setSelectedFileName("");
      toast.error("Rasmni tayyorlashda xatolik yuz berdi");
    } finally {
      setIsPreparing(false);
      event.target.value = "";
    }
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
          <div className={styles.cropperContainer}>
            <label className={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <Upload size={24} />
              <span>Rasm tanlang</span>
              <small>Rasm markazdan kvadrat ko'rinishda kesiladi</small>
            </label>
          </div>

          <div className={styles.infoBox}>
            {isPreparing
              ? "Rasm tayyorlanmoqda..."
              : selectedFileName || "PNG, JPG yoki WEBP fayl yuklang"}
          </div>
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
              disabled={isLoading || isPreparing}
            >
              {isLoading || isPreparing ? (
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
