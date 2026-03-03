import { useState, useEffect } from "react";
import styles from "./CreateOrganizationForm.module.css";
import {
  useCreateOrganizationMutation,
  useEditOrganizationMutation,
} from "../../../app/services/organizationApi";
import { toast } from "react-toastify";

function CreateOrganizationForm({ setIsOpen, editingOrg }) {
  const [orgData, setOrgData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    active: true,
  });

  const [createOrganization, { isLoading: isCreating }] =
    useCreateOrganizationMutation();
  const [editOrganization, { isLoading: isEditing }] =
    useEditOrganizationMutation();

  useEffect(() => {
    if (editingOrg) {
      setOrgData({
        name: editingOrg.name || "",
        description: editingOrg.description || "",
        logoUrl: editingOrg.logoUrl || "",
        active: editingOrg.active ?? true,
      });
    }
  }, [editingOrg]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setOrgData((state) => ({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingOrg) {
        await editOrganization({ id: editingOrg.id, data: orgData }).unwrap();
        toast.success("Tashkilot tahrirlandi!");
      } else {
        await createOrganization(orgData).unwrap();
        toast.success("Muvaffaqiyatli yaratildi!");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* --- Name --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={orgData.name}
          name="name"
          type="text"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Organization Name</label>
      </div>

      {/* --- Description --- */}
      <div className={styles.field}>
        <textarea
          onChange={handleChange}
          value={orgData.description}
          name="description"
          placeholder=" "
          className={`${styles.input} ${styles.textarea}`}
          required
        />
        <label className={styles.label}>Description</label>
      </div>

      {/* --- Logo URL --- */}
      <div className={styles.field}>
        <input
          onChange={handleChange}
          value={orgData.logoUrl}
          name="logoUrl"
          type="url"
          placeholder=" "
          className={styles.input}
          required
        />
        <label className={styles.label}>Logo URL</label>
      </div>

      {/* --- Active Status --- */}
      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="active"
            checked={orgData.active}
            onChange={handleChange}
          />
          <span>Is Active?</span>
        </label>
      </div>

      <button
        disabled={isCreating || isEditing}
        type="submit"
        className={styles.button}
      >
        {isCreating || isEditing
          ? "Saving..."
          : editingOrg
            ? "Update"
            : "Create"}
      </button>
    </form>
  );
}

export default CreateOrganizationForm;
