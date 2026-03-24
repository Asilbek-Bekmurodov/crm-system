import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Groups.module.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const {
    data: groups,
    isLoading,
    isError,
  } = useGetGroupsQuery(
    { query: "groups", organizationId: `${orgId}&size=1000` },
    { skip: !orgId || orgId === "undefined" },
  );

  const [deleteGroups, { isLoading: isDeleting }] = useDeleteGroupsMutation();
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();
  const [editGroup] = useEditGroupsMutation();
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  // 6. Filterni to'g'ri ishlatish
  const filteredData = useMemo(() => {
    const list = groups?.content || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (group) =>
        group.name?.toLowerCase().includes(searchStr) ||
        group.subjectName?.toLowerCase().includes(searchStr) ||
        group.teacherName?.toLowerCase().includes(searchStr),
    );
  }, [groups, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteGroups({ id, query: "groups", orgId }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.log(e);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const group = groups?.content?.find((u) => u.id === id);
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
    if (name === "teacherId" || name === "subjectId" || name === "price") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (payload.lessonStartTime && payload.lessonStartTime.length === 5) {
        payload.lessonStartTime = payload.lessonStartTime + ":00";
      }

      if (editingGroup) {
        await editGroup({
          query: "groups",
          data: payload,
          id: editingGroup.id,
        }).unwrap();
      } else {
        await createGroup({
          query: "groups",
          data: payload,
        }).unwrap();
      }

      toast.success(editingGroup ? "Groups tahrirlandi!" : "Groups yaratildi!");
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
        <h1>Guruhlar</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingGroup(null);
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
            placeholder="Search Group..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={GroupTableHeaders}
          data={filteredData}
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
                <td>
                  <button
                    className={styles.timetableBtn}
                    onClick={() => navigate(`/admin/timetable/${id}`)}
                    title="View Timetable"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <path d="M8 14h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 18h.01" />
                      <path d="M12 18h.01" />
                      <path d="M16 18h.01" />
                    </svg>
                  </button>
                </td>
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
          orgId={orgId}
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
