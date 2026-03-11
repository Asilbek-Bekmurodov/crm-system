import { useMemo, useState, useEffect } from "react"; // useEffect qo'shildi
import { useParams } from "react-router-dom";
import { useGetOrganizationByIdQuery } from "../../../app/services/organizationApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import { toast } from "react-toastify";
import styles from "./OrganizationDetail.module.css";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../app/services/userApi";
import { AdminTableHeaders } from "../../../../data/superAdmin";
import Modal from "../../../ui/Modal/Modal";
import Table from "../../../ui/Table/Table";
import CreateAdmin from "../CreateAdminForm/CreateAdmin";

// Dastlabki bo'sh holat (Formani tozalash uchun)
const initialFormState = {
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "ADMIN",
  organizationId: "",
  permissions: [],
};

function OrganizationDetail() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: admins, isLoading, isError } = useGetUserQuery("admins");
  const { data: org, isLoading: isOrgLoading } =
    useGetOrganizationByIdQuery(id);
  const {
    data: permissions,
    isLoading: isPerLoading,
    isError: isAdminCreateError,
  } = useGetPermissionsQuery();

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: id,
  });

  // 5. Edit qo'shish (EditingUser o'zgarganda formani to'ldirish)
  useEffect(() => {
    if (editingUser) {
      setFormData({
        username: editingUser.username || "",
        firstname: editingUser.firstname || "",
        lastname: editingUser.lastname || "",
        password: "", // Xavfsizlik uchun parolni bo'sh qoldiramiz
        role: editingUser.role || "ADMIN",
        organizationId: id,
        permissions: editingUser.permissions || [],
      });
    } else {
      setFormData({ ...initialFormState, organizationId: id });
    }
  }, [editingUser, id]);

  // 6. Filterni to'g'ri ishlatish
  const filteredData = useMemo(() => {
    const list = admins?.content || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr),
    );
  }, [admins, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteAdmin({ id, query: "admins" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const user = admins?.content?.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      // Bu yerda Create yoki Update logikasi bo'ladi
      await createAdmin({
        query: "admins",
        data: formData,
      }).unwrap();

      toast.success(editingUser ? "Admin tahrirlandi!" : "Admin yaratildi!");

      // 1. Forma tozalanishi va 4. Modal yopilishi
      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: id });
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isPerLoading || isOrgLoading || isDeleting)
    return <FirstLoader />;
  if (isError || isAdminCreateError) return <div>Something went wrong!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Admins</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null); // Yangi yaratish uchun editni tozalash
            setIsOpen(true);
          }}
        >
          + Create Admin
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
          headers={AdminTableHeaders}
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
          if (!value) setEditingUser(null);
        }}
        title={editingUser ? "Edit User" : "Create User"}
      >
        <CreateAdmin
          org={org}
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

export default OrganizationDetail;
