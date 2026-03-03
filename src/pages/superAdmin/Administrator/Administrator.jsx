import { useState } from "react";
import {
  useGetByRoleQuery,
  useDeleteUserMutation,
} from "../../../app/services/userApi";
import { AllTableHeaders } from "../../../../data/superAdmin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import Table from "../../../ui/Table/Table";
import Modal from "../../../ui/Modal/Modal";
import CreateUserForm from "../CreateUserForm/CreateUserForm";
import styles from "./Administrator.module.css";

function Administrator() {
  // 1. Ma'lumotlarni olish
  const {
    data: administrators,
    isLoading,
    isError,
  } = useGetByRoleQuery("ADMINISTRATOR");

  // 2. O'chirish mutatsiyasi
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // 3. Modal va tahrirlash holati
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong !</ShowError>;

  // 4. O'chirish funksiyasi
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
    const user = administrators.find((u) => u.id === id);
    setEditingUser(user);
    setIsOpen(true);
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Administratorlar Boshqaruvi</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge">Jami: {administrators?.length || 0}</span>
        </div>
      </header>

      {/* 6. Jadval */}
      <div className={styles.tableContainer}>
        <Table
          headers={AllTableHeaders}
          data={administrators}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* 7. Modal */}
      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingUser(null);
        }}
        title={
          editingUser ? "Adminni tahrirlash" : "Yangi administrator qo'shish"
        }
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default Administrator;
