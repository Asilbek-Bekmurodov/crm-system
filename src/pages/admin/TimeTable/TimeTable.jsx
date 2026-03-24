import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TimeTable.module.css";
import {
  useGetTimetablesByGroupQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
} from "../../../app/services/timetablesApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import Modal from "../../../ui/Modal/Modal";
import CreateTimeTable from "./CreateTimeTable";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "../../../ui/Table/Table";
import { TimeTableTableHeaders } from "../../../../data/Admin";

const initialFormState = {
  groupId: "",
  daysOfWeek: [],
  startTime: "",
  endTime: "",
  room: "",
};

function TimeTable() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const orgId = useSelector((state) => state.auth.orgId);
  const [isOpen, setIsOpen] = React.useState(false);
  const [editingTimetable, setEditingTimetable] = React.useState(null);
  const [formData, setFormData] = React.useState({
    ...initialFormState,
    groupId: groupId || "",
  });
  const [createTimetable, { isLoading: isCreating }] = useCreateTimetableMutation();
  const [updateTimetable, { isLoading: isUpdating }] = useUpdateTimetableMutation();
  const [deleteTimetable] = useDeleteTimetableMutation();

  const {
    data: timetables,
    isLoading,
    isError,
    refetch,
  } = useGetTimetablesByGroupQuery(groupId, {
    skip: !groupId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const days = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: days };
    });
  };

  const handleEdit = (id) => {
    const entry = timetables?.find((t) => t.id === id);
    if (entry) {
      setEditingTimetable(entry);
      setFormData({
        groupId: entry.groupId,
        daysOfWeek: [entry.dayOfWeek],
        startTime: entry.startTime.substring(0, 5),
        endTime: entry.endTime.substring(0, 5),
        room: entry.room,
      });
      setIsOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteTimetable(id).unwrap();
        toast.success("Successfully deleted");
        refetch();
      } catch (err) {
        toast.error("Error deleting entry");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingTimetable && formData.daysOfWeek.length === 0) {
      return toast.warning("Please select at least one day!");
    }

    try {
      if (editingTimetable) {
        await updateTimetable({
          id: editingTimetable.id,
          data: {
            groupId: Number(formData.groupId),
            dayOfWeek: formData.daysOfWeek[0],
            startTime: `${formData.startTime}:00`,
            endTime: `${formData.endTime}:00`,
            room: formData.room,
          },
        }).unwrap();
      } else {
        const promises = formData.daysOfWeek.map((day) => {
          const payload = {
            groupId: Number(formData.groupId),
            dayOfWeek: day,
            startTime: `${formData.startTime}:00`,
            endTime: `${formData.endTime}:00`,
            room: formData.room,
          };
          return createTimetable(payload).unwrap();
        });
        await Promise.all(promises);
      }

      toast.success(
        editingTimetable
          ? "Successfully updated!"
          : "Timetable successfully saved!"
      );
      setIsOpen(false);
      setEditingTimetable(null);
      setFormData({ ...initialFormState, groupId: groupId || "" });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred while saving");
    }
  };

  if (isLoading) return <FirstLoader />;
  if (isError) return <div className={styles.error}>Error loading timetable.</div>;

  const currentGroup = timetables?.[0]?.groupName || "Timetable";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>{currentGroup} Timetable</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingTimetable(null);
            setFormData({ ...initialFormState, groupId: groupId || "" });
            setIsOpen(true);
          }}
        >
          + Add Lesson
        </button>
      </div>

      <div className={styles.tableContainer}>
        <Table
          headers={TimeTableTableHeaders}
          data={timetables || []}
          onDelete={handleDelete}
          onEdit={handleEdit}
          renderRow={({
            id,
            groupId: gId,
            groupName,
            dayOfWeek,
            startTime,
            endTime,
            room,
          }) => (
            <>
              <td>{id}</td>
              <td>{gId}</td>
              <td>{groupName}</td>
              <td>{dayOfWeek}</td>
              <td>{startTime}</td>
              <td>{endTime}</td>
              <td>{room}</td>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={isOpen}
        setIsOpen={(val) => {
          setIsOpen(val);
          if (!val) {
            setEditingTimetable(null);
            setFormData({ ...initialFormState, groupId: groupId || "" });
          }
        }}
        title={editingTimetable ? "Edit Timetable" : "Create Timetable"}
      >
        <CreateTimeTable
          orgId={orgId}
          formData={formData}
          handleInputChange={handleInputChange}
          handleDayChange={handleDayChange}
          handleSubmit={handleSubmit}
          isCreating={isCreating || isUpdating}
          isEditing={Boolean(editingTimetable)}
        />
      </Modal>
    </div>
  );
}

export default TimeTable;