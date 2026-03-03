import { useState } from "react";
import {
  useGetByRoleQuery,
  useDeleteUserMutation,
} from "../../../app/services/userApi";
import { AllTableHeaders } from "../../../../data/superAdmin";
import Table from "../../../ui/Table/Table";
import Modal from "../../../ui/Modal/Modal";
import CreateUserForm from "../CreateUserForm/CreateUserForm";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import styles from "./Admins.module.css";

function Admins() {
  const { data: admins, isLoading, isError } = useGetByRoleQuery("ADMIN");

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Xatolik yuz berdi!</ShowError>;

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham ushbu adminni o'chirmoqchimisiz?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (e) {
        console.error("O'chirishda xatolik:", e);
      }
    }
  }

  // 5. Tahrirlash funksiyasi
  function handleEdit(id) {
    const user = admins.find((u) => u.id === id);
    setEditingUser(user); // Tahrirlanayotgan adminni saqlaymiz
    setIsOpen(true); // Modalni ochamiz
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Adminlar Boshqaruvi</h1>
        <div className={styles.actions}>
          <span className="badge">Jami: {admins?.length || 0}</span>
        </div>
      </header>

      {/* 6. Table komponentiga barcha proplarni uzatamiz */}
      <Table
        headers={AllTableHeaders}
        data={admins}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* 7. Modal oynasi */}
      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingUser(null);
        }}
        title={editingUser ? "Adminni tahrirlash" : "Admin yaratish"}
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default Admins;
