import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Student.module.css";
import { useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserQuery,
} from "../../../app/services/userApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import { toast } from "react-toastify";
import { StudentTableHeaders } from "../../../../data/Admin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import CreateStudent from "./CreateStudent";
import { useGetGroupsQuery } from "../../../app/services/groupsApi";

const initialFormState = {
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "STUDENT",
  organizationId: "",
  permissions: [],
  age: "",
  gender: "",
  enrolledGroupIds: [],
  parentPhoneNumbers: [],
};

function Students() {
  const orgId = useSelector((state) => state.auth.orgId);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: allUsers,
    isLoading,
    isError,
  } = useGetUserQuery("users");
  
  const { data: groups, isLoading: isGroupsLoading } = useGetGroupsQuery({ query: "groups", organizationId: orgId });
  const { data: permissionsData, isLoading: isPermLoading } = useGetPermissionsQuery();

  const [deleteAdmin, { isLoading: isDeletingItems }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const [editAdmin] = useEditUserMutation();
  
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  const filteredData = useMemo(() => {
    const list = allUsers?.content || allUsers || [];
    const studentsList = list.filter(user => user.role === "STUDENT");
    
    if (!searchTerm) return studentsList;

    const searchStr = searchTerm.toLowerCase();
    return studentsList.filter(
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

  async function handleDelete(userId) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteAdmin({ id: userId, query: "users" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.error("Delete Student Error:", e);
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
        role: user.role || "STUDENT",
        organizationId: orgId,
        permissions: user.permissions || [],
        age: user.age || "",
        gender: user.gender || "",
        enrolledGroupIds: user.enrolledGroupIds || [],
        parentPhoneNumber: user.parentPhoneNumbers?.[0] || "",
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
    try {
      const payload = { 
        ...formData, 
        age: Number(formData.age),
        parentPhoneNumbers: formData.parentPhoneNumber ? [formData.parentPhoneNumber] : [],
        active: true,
        organizationId: Number(orgId),
        studentStatus: "ACTIVE",
        coins: 0,
        balance: 0
      };
      
      delete payload.parentPhoneNumber;

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

      toast.success(editingUser ? "Talaba tahrirlandi!" : "Talaba yaratildi!");
      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: orgId });
    } catch (err) {
      console.error("Submit Student Error:", err);
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isDeletingItems || isGroupsLoading || isPermLoading) return <FirstLoader />;
  if (isError) return <div>Something went wrong while fetching data.</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Students</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null);
            setFormData({ ...initialFormState, organizationId: orgId });
            setIsOpen(true);
          }}
        >
          + Create Student
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
          headers={StudentTableHeaders}
          data={filteredData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={(user) => (
            <>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.age || "—"}</td>
              <td>{user.gender || "—"}</td>
              <td>
                <span className="badge">
                  {user.enrolledGroups?.length || user.enrolledGroupIds?.length || 0} guruh
                </span>
              </td>
              <td>{user.parentPhoneNumbers?.[0] || user.parentPhoneNumber || "—"}</td>
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
            setFormData({ ...initialFormState, organizationId: orgId });
          }
        }}
        title={editingUser ? "Edit Student" : "Create Student"}
      >
        <CreateStudent
          groups={groups?.content || groups}
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isCreating={isCreating}
          groupedPermissions={groupedPermissions}
          handleCheckboxChange={handleCheckboxChange}
          handleGroupChange={handleGroupChange}
        />
      </Modal>
    </div>
  );
}

export default Students;
