import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useUploadProfilePictureMutation } from "../../../../app/services/userApi";
import { Check, Upload, X, Camera, RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import Cropper from "react-easy-crop";
import styles from "./ProfileAvatar.module.css";

function ProfileAvatar() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  
  const [uploadProfilePicture, { isLoading }] =
    useUploadProfilePictureMutation();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.setAttribute("crossOrigin", "anonymous");
      img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm faylini tanlang");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImage(reader.result);
      setSelectedFileName(file.name);
      setPreview(null);
    });
    reader.readAsDataURL(file);
  };

  const handleApplyCrop = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setPreview(previewUrl);
      setImage(null); // Close cropper
    } catch (e) {
      console.error(e);
      toast.error("Rasmni qirqishda xatolik yuz berdi");
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    const toastId = toast.loading("Rasm saqlanmoqda...");

    try {
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], "profile.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      await uploadProfilePicture(formData).unwrap();
      toast.success("Profil rasmi muvaffaqiyatli yangilandi!", {
        id: toastId,
        style: { borderRadius: "10px", background: "#10b981", color: "#fff" },
      });
    } catch (err) {
      toast.error("Xatolik: " + (err.data?.message || "Rasm yuklanmadi"), { id: toastId });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Profil rasmini yangilash</h2>
        <p className={styles.subtitle}>Tizimdagi ko'rinishingizni yangilang va shaxsiylashtiring</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.uploadCard}>
          <div className={styles.imageZone}>
            {preview ? (
              <div className={styles.previewContainer}>
                <div className={styles.previewWrapper}>
                  <img src={preview} alt="Preview" className={styles.largePreview} />
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => {
                        setPreview(null);
                        setImage(null);
                        setSelectedFileName("");
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className={styles.readyText}>Yuklashga tayyor!</p>
              </div>
            ) : (
              <label className={styles.dropZone}>
                <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                <div className={styles.uploadCircle}><Camera size={40} /></div>
                <div className={styles.uploadText}>
                  <h3>Rasm yuklash</h3>
                  <p>PNG, JPG yoki WEBP (max. 5MB)</p>
                </div>
                <span className={styles.browseBtn}>Qurilmadan tanlash</span>
              </label>
            )}
          </div>

          {preview && (
            <div className={styles.actionSection}>
              <div className={styles.buttonGroup}>
                <label className={styles.secondaryBtn}>
                  <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                  <RefreshCcw size={18} /> Boshqa tanlash
                </label>
                <button className={styles.primaryBtn} onClick={handleSave} disabled={isLoading}>
                  {isLoading ? <div className={styles.spinner}></div> : <><Check size={18} /> Saqlash</>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sideInfo}>
          <div className={styles.infoCard}>
            <h4>Maslahatlar</h4>
            <ul>
              <li>Yuz qismi aniq ko'ringan rasm tanlang.</li>
              <li>Sifatli rasm professional ko'rinish beradi.</li>
            </ul>
          </div>
        </div>
      </div>

      {image && (
        <div className={styles.cropperOverlay}>
          <div className={styles.cropperHeader}>
            <h3>Rasmni tahrirlash</h3>
            <button className={styles.closeBtn} onClick={() => setImage(null)}><X /></button>
          </div>
          <div className={styles.cropperBody}>
            <div className={styles.cropperContainer}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </div>
          <div className={styles.cropperFooter}>
            <div className={styles.zoomControls}>
              <ZoomOut size={20} />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className={styles.zoomRange}
              />
              <ZoomIn size={20} />
            </div>
            <button className={styles.applyBtn} onClick={handleApplyCrop}>
              Tanlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
