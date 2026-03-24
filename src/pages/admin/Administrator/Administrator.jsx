import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Administrator.module.css";
import { useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserQuery,
} from "../../../app/services/userApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import { toast } from "react-toastify";
import { AdministratorTableHeaders } from "../../../../data/Admin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import CreateAdministrator from "./CreateAdministrator";

const initialFormState = {
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "ADMINISTRATOR",
  organizationId: "",
  permissions: [],
  age: "",
  gender: "",
};

function Administrators() {
  const orgId = useSelector((state) => state.auth.orgId);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: allUsers,
    isLoading,
    isError,
  } = useGetUserQuery("users");
  
  const {
    data: permissionsData,
    isLoading: isPerLoading,
    isError: isAdminCreateError,
  } = useGetPermissionsQuery();

  const [deleteUserMutation, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const [editAdmin] = useEditUserMutation();
  
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  const filteredData = useMemo(() => {
    const list = allUsers?.content || allUsers || [];
    const administratorsList = list.filter(user => user.role === "ADMINISTRATOR" || user.role === "ADMIN");
    
    if (!searchTerm) return administratorsList;

    const searchStr = searchTerm.toLowerCase();
    return administratorsList.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr),
    );
  }, [allUsers, searchTerm]);

  const groupedPermissions = useMemo(() => {
    return permissionsData?.reduce((acc, permission) => {
      const group = permission.split("_")[0];
      if (!acc[group]) acc[group] = [];
      acc[group].push(permission);
      return acc;
    }, {});
  }, [permissionsData]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteUserMutation({ id, query: "users" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.error("Delete Error:", e);
        toast.error(e?.data?.message || "O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(userId) {
    const list = allUsers?.content || allUsers || [];
    const user = list.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        password: "", 
        role: user.role || "ADMINISTRATOR",
        organizationId: orgId,
        permissions: user.permissions || [],
        age: user.age || "",
        gender: user.gender || "",
      });
      setIsOpen(true);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  };

  const handleGroupChange = (groupPermissions, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...groupPermissions])]
        : prev.permissions.filter((p) => !groupPermissions.includes(p)),
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.permissions.length === 0) {
      toast.error("Kamida bitta huquq tanlang!");
      return;
    }

    try {
      const payload = { 
        ...formData, 
        age: Number(formData.age),
        active: true,
        organizationId: Number(orgId),
        parentPhoneNumbers: [],
        enrolledGroupIds: []
      };

      if (editingUser) {
        if (!payload.password) delete payload.password;
        await editAdmin({
          query: "users",
          data: payload,
          id: editingUser.id,
        }).unwrap();
      } else {
        await createAdmin({
          query: "users",
          data: payload,
        }).unwrap();
      }

      toast.success(
        editingUser ? "Administrator tahrirlandi!" : "Administrator yaratildi!",
      );

      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: orgId });
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isPerLoading || isDeleting) return <FirstLoader />;
  if (isError || isAdminCreateError) return <div className={styles.errorContainer}>Something went wrong while fetching data.</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Administrators</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null);
            setFormData({ ...initialFormState, organizationId: orgId });
            setIsOpen(true);
          }}
        >
          + Create Administrator
        </button>
      </div>

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

      <div className={styles.tableContainer}>
        <Table
          headers={AdministratorTableHeaders}
          data={filteredData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={(user) => (
            <>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.age || "—"}</td>
              <td>{user.gender || "—"}</td>
              <td>{user.username}</td>
              <td>
                <span className={`badge ${user.role === "ADMINISTRATOR" || user.role === "ADMIN" ? "badge-admin" : ""}`}>
                  {user.role === "ADMIN" ? "ADMINISTRATOR" : user.role}
                </span>
              </td>
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
            setFormData({ ...initialFormState, organizationId: orgId });
          }
        }}
        title={editingUser ? "Edit Admin" : "Create Admin"}
      >
        <CreateAdministrator
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

export default Administrators;
