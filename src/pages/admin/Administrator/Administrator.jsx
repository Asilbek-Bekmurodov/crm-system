import { useState } from "react";
import {
  useGetByRoleQuery,
  useDeleteUserMutation,
} from "../../../app/services/userApi";
import { AllTableHeaders } from "../../../../data/superAdmin";
import Table from "../../../ui/Table/Table";
import Modal from "../../../ui/Modal/Modal";
import CreateUserForm from "../../superAdmin/CreateUserForm/CreateUserForm";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import styles from "./Administrator.module.css";

function Administrator() {
  const {
    data: administrator,
    isLoading,
    isError,
  } = useGetByRoleQuery("ADMINISTRATOR");

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Xatolik yuz berdi!</ShowError>;

  async function handleDelete(id) {
    if (
      window.confirm("Haqiqatdan ham ushbu administratorni o'chirmoqchimisiz?")
    ) {
      try {
        await deleteUser(id).unwrap();
      } catch (e) {
        console.error("O'chirishda xatolik:", e);
      }
    }
  }

  // 5. Tahrirlash funksiyasi
  function handleEdit(id) {
    const user = administrator.find((u) => u.id === id);
    setEditingUser(user); // Tahrirlanayotgan adminni saqlaymiz
    setIsOpen(true); // Modalni ochamiz
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Administratorlar Boshqaruvi</h1>
        <div className={styles.actions}>
          <span className="badge">Jami: {administrator?.length || 0}</span>
        </div>
      </header>

      {/* 6. Table komponentiga barcha proplarni uzatamiz */}
      <Table
        headers={AllTableHeaders}
        data={administrator}
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
        title={
          editingUser ? "Administratorni tahrirlash" : "Administrator yaratish"
        }
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default Administrator;
