import styles from "./Modal.module.css";
import { IoCloseOutline } from "react-icons/io5";

function Modal({ title, children, setIsOpen, isOpen }) {
  const handleClose = () => {
    setIsOpen(false);
    // setTimeout(() => {}, 200);
  };

  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.modalOpening : styles.modalClosing}`}
    >
      <div
        className={`${styles.modalContent} ${
          !isOpen ? styles.modalContentClosing : ""
        }`}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <IoCloseOutline className={styles.closeIcon} onClick={handleClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
