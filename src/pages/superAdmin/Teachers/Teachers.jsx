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
import styles from "./Teachers.module.css";

function Teachers() {
  // 1. Ma'lumotlarni olish (Faqat TEACHER rolidagilar)
  const { data: teachers, isLoading, isError } = useGetByRoleQuery("TEACHER");

  // 2. O'chirish mutatsiyasi
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // 3. Modal va tahrirlash holati (State)
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Xatolik yuz berdi!</ShowError>;

  // 4. O'chirish funksiyasi
  async function handleDelete(id) {
    if (
      window.confirm("Haqiqatdan ham ushbu o'qituvchini o'chirmoqchimisiz?")
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
    const user = teachers.find((u) => u.id === id);
    setEditingUser(user);
    setIsOpen(true);
  }

  return (
    <div className={styles.pagContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>O'qituvchilar boshqaruvi</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge">Jami: {teachers?.length || 0}</span>
        </div>
      </header>

      {/* 6. Jadval qismi */}
      <div className={styles.tableContainer}>
        <Table
          headers={AllTableHeaders}
          data={teachers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* 7. Modal oynasi (Tahrirlash va Yaratish uchun) */}
      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingUser(null);
        }}
        title={
          editingUser ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"
        }
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default Teachers;
