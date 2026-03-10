import { useMemo, useState } from "react";
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

function OrganizationDetail() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: admins = [], isLoading, isError } = useGetUserQuery("admins");
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
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "ADMIN",
    organizationId: id,
    permissions: [],
  });

  const filteredUsers = useMemo(() => {
    return admins?.content?.filter((user) => {
      // 2. Qidiruv bo'yicha filtrlash (Ism, Familiya yoki Username)
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr);

      return matchesSearch;
    });
  }, [admins, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteAdmin({ id, query: "admins" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.error("O'chirishda xatotlik:", e);
        toast.error("Nimadur xato kedi!");
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

  function handleClick(item) {
    const resolvedId = item?.id;
    console.log("row click id:", resolvedId);
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
      let res = await createAdmin({
        query: "admins",
        data: formData,
      }).unwrap();
      console.log(res);

      toast.success("Admin muvaffaqiyatli yaratildi!");
      // navigate("/organizations");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isPerLoading || isOrgLoading || isDeleting)
    return <FirstLoader />;
  if (isError || isAdminCreateError)
    return <ShowError>Something went wrong!</ShowError>;

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Admins</h1>
        <button className={styles.createBtn} onClick={() => setIsOpen(true)}>
          + Create Admin
        </button>
      </div>

      {/* CONTROLS: Filtrlar va Input */}
      <div className={styles.controls}>
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
          headers={AdminTableHeaders}
          data={filteredUsers.content || admins.content}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onNavigate={handleClick}
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
