import { useNavigate, useParams } from "react-router-dom";
import styles from "./Subject.module.css";
import Table from "../../../ui/Table/Table";
import { useState, useMemo } from "react";
import Modal from "../../../ui/Modal/Modal";
import CreateTopic from "./CreateTopic";
import { toast } from "react-toastify";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import {
  useGetSubjectsQuery,
  useCreateSubjectsMutation,
  useEditSubjectsMutation,
  useDeleteSubjectsMutation,
} from "../../../app/services/subjectsApi";
import { SubjectTopicTableHeaders } from "../../../../data/Admin";

const initialFormState = {
  name: "",
  description: "",
  orderNumber: "",
};

function SubjectTopics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    ...initialFormState,
    subjectId: Number(id),
  });
  
  const { data: topics, isLoading, isError } = useGetSubjectsQuery(`topics/subject/${id}`);
  
  const [deleteTopic, { isLoading: isDeleting }] = useDeleteSubjectsMutation();
  const [createTopic, { isLoading: isCreating }] = useCreateSubjectsMutation();
  const [editTopic] = useEditSubjectsMutation();

  const filteredData = useMemo(() => {
    const list = topics || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchStr) ||
        item.description?.toLowerCase().includes(searchStr)
    );
  }, [topics, searchTerm]);

  async function handleDelete(topicId) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteTopic({ id: topicId, query: "topics" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (err) {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(topicId) {
    const topic = topics?.find((u) => u.id === topicId);
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        name: topic.name ?? "",
        description: topic.description ?? "",
        orderNumber: topic.orderNumber ?? "",
        subjectId: Number(id),
      });
      setIsOpen(true);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        orderNumber: Number(formData.orderNumber),
        subjectId: Number(id),
      };

      if (editingTopic) {
        await editTopic({
          query: "topics",
          id: editingTopic.id,
          data: payload,
        }).unwrap();
        toast.success("Mavzu tahrirlandi!");
      } else {
        await createTopic({
          query: "topics/subject",
          data: payload,
        }).unwrap();
        toast.success("Mavzu yaratildi!");
      }

      setIsOpen(false);
      setEditingTopic(null);
      setFormData({ ...initialFormState, subjectId: Number(id) });
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  if (isLoading || isDeleting) return <FirstLoader />;
  if (isError) return <div>Xatolik yuz berdi!</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Mavzular</h1>
        <div>
          <button
            className={styles.createBtn}
            onClick={() => {
              setEditingTopic(null);
              setFormData({ ...initialFormState, subjectId: Number(id) });
              setIsOpen(true);
            }}
          >
            + Create Topic
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search topic..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={SubjectTopicTableHeaders}
          data={filteredData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onNavigate={(item) => console.log("Navigate topic", item)}
          renderRow={(item) => (
            <>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.orderNumber}</td>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          if (!value) {
            setEditingTopic(null);
            setFormData({ ...initialFormState, subjectId: Number(id) });
          }
        }}
        title={editingTopic ? "Mavzuni tahrirlash" : "Mavzu yaratish"}
      >
        <CreateTopic
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isCreating={isCreating}
          isEditing={Boolean(editingTopic)}
        />
      </Modal>
    </div>
  );
}

export default SubjectTopics;
