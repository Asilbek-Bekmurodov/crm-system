import { useNavigate } from "react-router-dom";
import styles from "./Notfound.module.css";
import { MoveLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>Sahifa topilmadi</h2>
        <p className={styles.description}>
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </p>

        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <MoveLeft size={20} />
          <span>Orqaga qaytish</span>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
