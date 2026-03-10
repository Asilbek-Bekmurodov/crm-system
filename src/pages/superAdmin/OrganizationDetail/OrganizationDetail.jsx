import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrganizationByIdQuery } from "../../../app/services/organizationApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import { toast } from "react-hot-toast";
import styles from "./OrganizationDetail.module.css";
import { useCreateUserMutation } from "../../../app/services/userApi";

function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: org, isLoading: isOrgLoading } =
    useGetOrganizationByIdQuery(id);
  const { data: permissions, isLoading: isPerLoading } =
    useGetPermissionsQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "ADMIN",
    organizationId: id,
    permissions: [],
  });

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const group = permission.split("_")[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(permission);
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await createAdmin(formData).unwrap();
      toast.success("Admin muvaffaqiyatli yaratildi!");
      navigate("/organizations");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  }

  if (isOrgLoading || isPerLoading) return <FirstLoader />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{org?.name || "Tashkilot"}</h1>
        <p className={styles.subtitle}>
          Yangi admin yaratish va huquqlarni biriktirish
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Foydalanuvchi nomi (Username)
            </label>
            <input
              name="username"
              className={styles.inputField}
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Ismi</label>
            <input
              name="firstname"
              className={styles.inputField}
              type="text"
              required
              value={formData.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Familiyasi</label>
            <input
              name="lastname"
              className={styles.inputField}
              type="text"
              required
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Parol</label>
            <input
              name="password"
              className={styles.inputField}
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Huquqlarni belgilash</h2>

        <div className={styles.permissionsGrid}>
          {groupedPermissions &&
            Object.keys(groupedPermissions).map((group) => {
              const groupPermissions = groupedPermissions[group];
              const allChecked = groupPermissions.every((p) =>
                formData.permissions.includes(p),
              );

              return (
                <div
                  key={group}
                  className={`${styles.permissionGroup} ${
                    allChecked ? styles.permissionGroupActive : ""
                  }`}
                >
                  <div className={styles.groupHeader}>
                    <label className={styles.groupTitleLabel}>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) =>
                          handleGroupChange(groupPermissions, e.target.checked)
                        }
                      />
                      <span className={styles.groupName}>
                        {group} (Barchasi)
                      </span>
                    </label>
                  </div>

                  <div className={styles.groupContent}>
                    {groupPermissions.map((el) => (
                      <label key={el} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          value={el}
                          checked={formData.permissions.includes(el)}
                          onChange={handleCheckboxChange}
                        />
                        <span className={styles.permName}>
                          {el.includes("_")
                            ? el.split("_").slice(1).join(" ")
                            : el}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isCreating}
          >
            {isCreating ? "Saqlanmoqda..." : "Adminni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrganizationDetail;
