import styles from "./ShowError.module.css";
import { FiAlertCircle } from "react-icons/fi";

function ShowError({ children }) {
  return (
    <div className={styles.wrapper}>
      <FiAlertCircle className={styles.icon} />
      <span>{children}</span>
    </div>
  );
}

export default ShowError;
