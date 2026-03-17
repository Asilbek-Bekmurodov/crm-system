import { useSelector } from "react-redux";
import Modal from "../../../ui/Modal/Modal";
import styles from "./Subject.module.css";
import { useState, useMemo } from "react";

import { toast } from "react-toastify";
import { SubjectTableHeaders } from "../../../../data/Admin";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Table from "../../../ui/Table/Table";
import {
  useCreateSubjectsMutation,
  useDeleteSubjectsMutation,
  useEditSubjectsMutation,
  useGetSubjectsQuery,
} from "../../../app/services/subjectsApi";
import CreateSubject from "./CreateSubject";

const initialFormState = {
  name: "",
  description: "",
};

import { useNavigate, useLocation } from "react-router-dom";

function Subject() {
  const orgId = useSelector((state) => state.auth.orgId);


  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { data: subjects, isLoading, isError } = useGetSubjectsQuery("subjects");

  const [deleteSubjects, { isLoading: isDeleting }] = useDeleteSubjectsMutation();
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectsMutation();
  const [editSubject] = useEditSubjectsMutation();
  
  const [formData, setFormData] = useState({
    ...initialFormState,
    organizationId: orgId,
  });

  const filteredData = useMemo(() => {
    const list = subjects || [];
    if (!searchTerm) return list;

    const searchStr = searchTerm.toLowerCase();
    return list.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchStr) ||
        item.description?.toLowerCase().includes(searchStr)
    );
  }, [subjects, searchTerm]);

  async function handleDelete(id) {
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      try {
        await deleteSubjects({ id, query: "subjects" }).unwrap();
        toast.success("Muvaffaqiyatli o'chirildi");
      } catch (e) {
        console.log(e);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  }

  function handleEdit(id) {
    const subject = subjects?.find((u) => u.id === id);
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name ?? "",
        description: subject.description ?? "",
        organizationId: orgId,
      });
      setIsOpen(true);
    }
  }

  function handleNavigate(subject) {
    const currentPath = location.pathname;
    const path = currentPath.endsWith('/') ? `${currentPath}${subject.id}` : `${currentPath}/${subject.id}`;
    navigate(path);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingSubject) {
        await editSubject({
          query: "subjects",
          data: formData,
          id: editingSubject.id,
        }).unwrap();
      } else {
        await createSubject({
          query: "subjects",
          data: formData,
        }).unwrap();
      }

      toast.success(editingSubject ? "Fan tahrirlandi!" : "Fan yaratildi!");

      setIsOpen(false);
      setEditingSubject(null);
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
        <h1>Fanlar</h1>
        <button
          className={styles.createBtn}
          onClick={() => {
            setEditingSubject(null);
            setFormData({ ...initialFormState, organizationId: orgId });
            setIsOpen(true);
          }}
        >
          + Create Subject
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search group..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={SubjectTableHeaders}
          data={filteredData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onNavigate={handleNavigate}
          renderRow={({
            id,
            name,
            description,
          }) => {
            return (
              <>
                <td>{name}</td>
                <td>{description}</td>
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
            setEditingSubject(null);
            setFormData({ ...initialFormState, organizationId: orgId });
          }
        }}
        title={editingSubject ? "Fanni tahrirlash" : "Fan yaratish"}
      >
        <CreateSubject
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          isCreating={isCreating}
          isEditing={Boolean(editingSubject)}
        />
      </Modal>
    </div>
  );
}

export default Subject;
