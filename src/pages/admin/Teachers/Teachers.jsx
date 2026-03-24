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
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import CreateTeacher from "./CreateTeacher";
import { useGetGroupsQuery } from "../../../app/services/groupsApi";

const initialFormState = {
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  role: "TEACHER",
  organizationId: "",
  permissions: [],
  age: "",
  gender: "",
  enrolledGroupIds: [],
  profilePictureUrl: "",
};

function Teachers() {
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
  const { 
    data: permissionsData, 
    isLoading: isPermLoading 
  } = useGetPermissionsQuery();

  const [deleteUserMutation, { isLoading: isDeletingItems }] = useDeleteUserMutation();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();
  const [editAdmin] = useEditUserMutation();
  
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  const filteredData = useMemo(() => {
    const list = allUsers?.content || allUsers || [];
    const teachersList = list.filter(user => user.role === "TEACHER");
    
    if (!searchTerm) return teachersList;

    const searchStr = searchTerm.toLowerCase();
    return teachersList.filter(
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
        await deleteUserMutation({ id: userId, query: "users" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.error("Delete Teacher Error:", e);
        toast.error(e?.data?.message || "O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(userId) {
    const list = allUsers?.content || allUsers || [];
    const user = list.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      
      let gIds = user.enrolledGroupIds || [];
      if (user.enrolledGroups && Array.isArray(user.enrolledGroups)) {
        gIds = user.enrolledGroups.map(g => g.id || g);
      }

      setFormData({
        username: user.username || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        password: "", 
        role: user.role || "TEACHER",
        organizationId: orgId,
        permissions: user.permissions || [],
        age: user.age || "",
        gender: user.gender || "",
        enrolledGroupIds: gIds,
        profilePictureUrl: user.profilePictureUrl || "",
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
        active: true,
        organizationId: Number(orgId),
        enrolledGroupNames: [],
        qualifiedSubjectIds: [],
        qualifiedSubjectNames: [],
        parentPhoneNumbers: [],
        studentStatus: "ACTIVE",
        coins: 0,
        balance: 0
      };

      if (payload.profilePictureUrl && payload.profilePictureUrl.startsWith("data:")) {
        delete payload.profilePictureUrl;
      } else if (!payload.profilePictureUrl) {
        delete payload.profilePictureUrl;
      }

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

      toast.success(editingUser ? "O'qituvchi tahrirlandi!" : "O'qituvchi yaratildi!");
      setIsOpen(false);
      setEditingUser(null);
      setFormData({ ...initialFormState, organizationId: orgId });
    } catch (err) {
      console.error("Submit Teacher Error:", err);
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isDeletingItems || isGroupsLoading || isPermLoading) return <FirstLoader />;
  if (isError) return <div className={styles.errorText}>Something went wrong while fetching data.</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Teachers</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingUser(null);
            setFormData({ ...initialFormState, organizationId: orgId });
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
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={TeacherTableHeaders}
          data={filteredData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={(user) => {
            let userGroups = user.enrolledGroups || [];
            if (user.enrolledGroupIds && !user.enrolledGroups) {
               userGroups = user.enrolledGroupIds.map(id => ({ id, name: `Guruh #${id}` }));
            }

            return (
              <>
                <td className={styles.userCell}>
                  {user.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt="" className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                    </div>
                  )}
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.firstname} {user.lastname}</span>
                    <span className={styles.userUsername}>@{user.username}</span>
                  </div>
                </td>
                <td><span className={styles.ageBadge}>{user.age || "—"} yosh</span></td>
                <td>
                   <span className={`${styles.genderBadge} ${user.gender === 'MALE' ? styles.male : styles.female}`}>
                    {user.gender === 'MALE' ? 'Erkak' : 'Ayol'}
                  </span>
                </td>
                <td>
                  <div className={styles.groupChips}>
                    {userGroups.length > 0 ? (
                      userGroups.map((group, idx) => (
                        <span key={idx} className={styles.groupChip}>{group.name || group}</span>
                      ))
                    ) : (
                      <span className={styles.noGroups}>Guruh yo'q</span>
                    )}
                  </div>
                </td>
                <td>{user.role}</td>
              </>
            );
          }}
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
        title={editingUser ? "Edit Teacher" : "Create Teacher"}
      >
        <CreateTeacher
          groups={groups?.content || groups}
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isCreating={isCreating}
          setFormData={setFormData}
          groupedPermissions={groupedPermissions}
          handleCheckboxChange={handleCheckboxChange}
          handleGroupChange={handleGroupChange}
        />
      </Modal>
    </div>
  );
}

export default Teachers;
