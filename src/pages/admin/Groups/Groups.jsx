import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Groups.module.css";
import { useState } from "react";

import { toast } from "react-toastify";
import { GroupTableHeaders } from "../../../../data/Admin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import {
  useCreateGroupMutation,
  useDeleteGroupsMutation,
  useEditGroupsMutation,
  useGetGroupsQuery,
} from "../../../app/services/groupsApi";
import CreateGroup from "./CreateGroups";

const initialFormState = {
  name: "",
  price: "",
  subjectId: "",
  teacherId: "",
  description: "",
  daysOfWeek: [],
  lessonStartTime: "",
  studentIds: [],
};

function Groups() {
  const orgId = useSelector((state) => state.auth.orgId);

  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: groups, isLoading, isError } = useGetGroupsQuery("groups");

  const [deleteGroups, { isLoading: isDeleting }] = useDeleteGroupsMutation();
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
  const [editGroup] = useEditGroupsMutation();
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  // 6. Filterni to'g'ri ishlatish
  // const filteredData = useMemo(() => {
  //   const list = groups?.content || [];
  //   if (!searchTerm) return list;

  //   const searchStr = searchTerm.toLowerCase();
  //   return list.filter(
  //     (user) =>
  //       user.firstname?.toLowerCase().includes(searchStr) ||
  //       user.lastname?.toLowerCase().includes(searchStr) ||
  //       user.username?.toLowerCase().includes(searchStr),
  //   );
  // }, [groups, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteGroups({ id, query: "groups" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.log(e);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const group = groups?.find((u) => u.id === id);
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name ?? "",
        price: group.price ?? "",
        subjectId: group.subjectId === null ? "" : Number(group.subjectId),
        teacherId: group.teacherId === undefined ? "" : Number(group.teacherId),
        description: group.description ?? "",
        daysOfWeek: group.daysOfWeek || [],
        lessonStartTime: group.lessonStartTime ?? "",
        studentIds: group.studentIds || [],
        organizationId: orgId,
      });
      setIsOpen(true);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "teacherId") {
      setFormData((prev) => {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      });
    } else if (name === "subjectId") {
      setFormData((prev) => {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingGroup) {
        await editGroup({
          query: "groups",
          data: formData,
          id: editingGroup.id,
        }).unwrap();
      } else {
        await createGroup({
          query: "groups",
          data: formData,
        }).unwrap();
      }

      toast.success(editingGroup ? "Groups tahrirlandi!" : "Groups yaratildi!");

      // 1. Forma tozalanishi va 4. Modal yopilishi
      setIsOpen(false);
      setEditingGroup(null);
      setFormData({ ...initialFormState, organizationId: orgId });
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Student</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingGroup(null); // Yangi yaratish uchun editni tozalash
            setFormData({ ...initialFormState, organizationId: orgId });
            setIsOpen(true);
          }}
        >
          + Create Group
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search Group..." // 3. Placeholder qo'shildi
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={GroupTableHeaders}
          data={groups} // 6. Filterlangan ma'lumot uzatildi
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={({
            id,
            name,
            description,
            subjectName,
            teacherName,
            price,
            lessonStartTime,
          }) => {
            console.log(lessonStartTime);
            return (
              <>
                <td>{id}</td>
                <td>{name}</td>
                <td>{description}</td>
                <td>{subjectName}</td>
                <td>{teacherName}</td>
                <td>{price}</td>
                <td>{lessonStartTime}</td>
                <td></td>
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
            setEditingGroup(null);
            setFormData({ ...initialFormState, organizationId: orgId });
          }
        }}
        title={editingGroup ? "Edit Group" : "Create Group"}
      >
        <CreateGroup
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isCreating={isCreating}
          isEditing={Boolean(editingGroup)}
        />
      </Modal>
    </div>
  );
}
export default Groups;
