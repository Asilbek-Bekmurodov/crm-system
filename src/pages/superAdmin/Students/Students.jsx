import { useState } from "react";
import { AllTableHeaders } from "../../../../data/superAdmin";
import {
  useGetByRoleQuery,
  useDeleteUserMutation,
} from "../../../app/services/userApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import ShowError from "../../../ui/ShowError/ShowError";
import Table from "../../../ui/Table/Table";
import Modal from "../../../ui/Modal/Modal";
import CreateUserForm from "../CreateUserForm/CreateUserForm";
import styles from "./Students.module.css";

function Students() {
  // 1. Ma'lumotlarni olish (Faqat STUDENT rolidagilar)
  const { data: students, isLoading, isError } = useGetByRoleQuery("STUDENT");

  // 2. O'chirish mutatsiyasi
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // 3. Modal va tahrirlash holati
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Xatolik yuz berdi!</ShowError>;

  // 4. O'chirish funksiyasi
  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham ushbu talabani o'chirmoqchimisiz?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (e) {
        console.error("O'chirishda xatolik:", e);
      }
    }
  }

  // 5. Tahrirlash funksiyasi
  function handleEdit(id) {
    const user = students.find((u) => u.id === id);
    setEditingUser(user);
    setIsOpen(true);
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Studentlar Boshqaruvi</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge">Jami: {students?.length || 0}</span>
        </div>
      </header>

      {/* 6. Jadval */}
      <div className={styles.tableContainer}>
        <Table
          headers={AllTableHeaders}
          data={students}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* 7. Modal (Edit va Create uchun bitta forma) */}
      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingUser(null);
        }}
        title={editingUser ? "Studentni tahrirlash" : "Yangi student qo'shish"}
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default Students;
