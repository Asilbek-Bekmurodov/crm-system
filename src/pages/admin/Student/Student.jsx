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
import { useGetGroupsQuery } from "../../../app/services/groupsApi";
import { toast } from "react-toastify";
import { StudentTableHeaders } from "../../../../data/Admin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import CreateStudent from "./CreateStudent";

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
  parentPhoneNumber: "",
};

function Students() {
  const id = useSelector((state) => state.auth.orgId);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students, isLoading, isError } = useGetUserQuery("students");
  const {
    data: permissions,  
    isLoading: isPerLoading,
    isError: isAdminCreateError,
  } = useGetPermissionsQuery();

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
  } = useGetGroupsQuery({ query: "groups", organizationId: `${id}&size=1000` }, { skip: !id });
  const groups = groupsData?.content || [];

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const [editAdmin] = useEditUserMutation();
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: id,
  });

  const filteredData = useMemo(() => {
    const list = students?.content || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(searchStr) ||
        user.lastname?.toLowerCase().includes(searchStr) ||
        user.username?.toLowerCase().includes(searchStr),
    );
  }, [students, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteAdmin({ id, query: "students" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.log(e);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const user = students?.content?.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        password: "", 
        role: user.role || "STUDENT",
        organizationId: id,
        permissions: user.permissions || [],
        age: user.age || "",
        gender: user.gender || "",
        enrolledGroupIds: user.enrolledGroupIds || [],
        parentPhoneNumber: user.parentPhoneNumbers?.[0] || "",
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
      const payload = { ...formData };
      if (payload.age) {
        payload.age = Number(payload.age);
      } else {
        payload.age = null;
      }
      if (payload.parentPhoneNumber) {
        payload.parentPhoneNumbers = [payload.parentPhoneNumber];
      } else {
        payload.parentPhoneNumbers = [];
      }
      delete payload.parentPhoneNumber;

      if (editingUser) {
        if (!payload.password) delete payload.password;
        await editAdmin({
          query: "students",
          data: payload,
          id: editingUser.id,
        }).unwrap();
      } else {
        await createAdmin({
          query: "students",
          data: payload,
        }).unwrap();
      }

      toast.success(
        editingUser ? "Student tahrirlandi!" : "Student yaratildi!",
      );

      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: id });
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isPerLoading || isDeleting || isGroupsLoading) return <FirstLoader />;
  if (isError || isAdminCreateError) return <div>Something went wrong!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Student</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null);
            setFormData({ ...initialFormState, organizationId: id });
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
              <td>{user.age || "-"}</td>
              <td>{user.gender || "-"}</td>
              <td>
                {user.enrolledGroupIds && user.enrolledGroupIds.length > 0
                  ? user.enrolledGroupIds
                      .map((gId) => groups.find((g) => g.id === gId)?.name)
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </td>
              <td>
                {user.parentPhoneNumbers && user.parentPhoneNumbers.length > 0
                  ? user.parentPhoneNumbers.join(", ")
                  : "-"}
              </td>
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
        title={editingUser ? "Edit Student" : "Create Student"}
      >
        <CreateStudent
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          groupedPermissions={groupedPermissions}
          handleGroupChange={handleGroupChange}
          isCreating={isCreating}
          handleCheckboxChange={handleCheckboxChange}
          groups={groups}
        />
      </Modal>
    </div>
  );
}
export default Students;
