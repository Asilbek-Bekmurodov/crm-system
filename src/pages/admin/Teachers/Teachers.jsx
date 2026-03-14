import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Teacher.module.css";

import { useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserQuery,
} from "../../../app/services/userApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import { toast } from "react-toastify";
import { TeacherTableHeaders } from "../../../../data/Admin";
import CreateTeacher from "./CreateTeacher";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";

const initialFormState = {
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "TEACHER",
  organizationId: "",
  permissions: [],
};

function Teachers() {
  const id = useSelector((state) => state.auth.orgId);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: teachers, isLoading, isError } = useGetUserQuery("teachers");
  const {
    data: permissions,
    isLoading: isPerLoading,
    isError: isAdminCreateError,
  } = useGetPermissionsQuery();

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const [editAdmin] = useEditUserMutation();
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: id,
  });

  // 6. Filterni to'g'ri ishlatish
  const filteredData = useMemo(() => {
    const list = teachers?.content || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr),
    );
  }, [teachers, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteAdmin({ id, query: "teachers" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.log(e);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const user = teachers?.content?.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        password: "", // Xavfsizlik uchun parolni bo'sh qoldiramiz
        role: user.role || "TEACHER",
        organizationId: id,
        permissions: user.permissions || [],
      });
      setIsOpen(true);
    }
  }

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const group = permission.split("_")[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(permission);
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      console.log(prev);
      return { ...prev, [name]: value };
    });
  };

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  }

  function handleGroupChange(groupPermissions, checked) {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...groupPermissions])]
        : prev.permissions.filter((p) => !groupPermissions.includes(p)),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.permissions.length === 0) {
      toast.error("Kamida bitta huquq tanlang!");
      return;
    }

    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await editAdmin({
          query: "teachers",
          data: payload,
          id: editingUser.id,
        }).unwrap();
      } else {
        await createAdmin({
          query: "teachers",
          data: formData,
        }).unwrap();
      }

      toast.success(
        editingUser ? "Teacher tahrirlandi!" : "Teacher yaratildi!",
      );

      // 1. Forma tozalanishi va 4. Modal yopilishi
      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: id });
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isPerLoading || isDeleting) return <FirstLoader />;
  if (isError || isAdminCreateError) return <div>Something went wrong!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Teachers</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null); // Yangi yaratish uchun editni tozalash
            setFormData({ ...initialFormState, organizationId: id });
            setIsOpen(true);
          }}
        >
          + Create Teacher
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..." // 3. Placeholder qo'shildi
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={TeacherTableHeaders}
          data={filteredData} // 6. Filterlangan ma'lumot uzatildi
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

      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) {
            setEditingUser(null);
            setFormData({ ...initialFormState, organizationId: id });
          }
        }}
        title={editingUser ? "Edit Teacher" : "Create Teacher"}
      >
        <CreateTeacher
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          groupedPermissions={groupedPermissions}
          handleGroupChange={handleGroupChange}
          isCreating={isCreating}
          handleCheckboxChange={handleCheckboxChange}
        />
      </Modal>
    </div>
  );
}
export default Teachers;
