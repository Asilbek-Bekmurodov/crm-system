import { useState, useMemo } from "react";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../app/services/userApi";
import Table from "../../../ui/Table/Table";
import styles from "./All.module.css";
import { AllTableHeaders } from "../../../../data/superAdmin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Modal from "../../../ui/Modal/Modal";
import CreateUserForm from "../CreateUserForm/CreateUserForm";
import ShowError from "../../../ui/ShowError/ShowError";

function All() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading, isError } = useGetUserQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // --- FILTRLASH VA QIDIRUV MANTIQLARI ---
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Rol bo'yicha filtrlash
      const matchesRole = filterRole === "ALL" || user.role === filterRole;

      // 2. Qidiruv bo'yicha filtrlash (Ism, Familiya yoki Username)
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr);

      return matchesRole && matchesSearch;
    });
  }, [users, filterRole, searchTerm]);

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <ShowError>Something went wrong!</ShowError>;

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (e) {
        console.error("O'chirishda xatolik:", e);
      }
    }
  }

  function handleEdit(id) {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setIsOpen(true);
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>{filterRole === "ALL" ? "All" : filterRole} Users</h1>
        <button className={styles.createBtn} onClick={() => setIsOpen(true)}>
          + Create User
        </button>
      </div>

      {/* CONTROLS: Filtrlar va Input */}
      <div className={styles.controls}>
        <div className={styles.filterButtons}>
          {["ALL", "ADMIN", "STUDENT", "TEACHER", "ADMINISTRATOR"].map(
            (role) => (
              <button
                key={role}
                className={`${styles.filterBtn} ${filterRole === role ? styles.activeFilter : ""}`}
                onClick={() => setFilterRole(role)}
              >
                {role === "ALL"
                  ? "All users"
                  : role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ),
          )}
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <Table
          headers={AllTableHeaders}
          data={filteredUsers}
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={(user) => (
            <>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
            </>
          )}
        />
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) setEditingUser(null);
        }}
        title={editingUser ? "Edit User" : "Create User"}
      >
        <CreateUserForm setIsOpen={setIsOpen} editingUser={editingUser} />
      </Modal>
    </div>
  );
}

export default All;
