import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOrganizationByIdQuery } from "../../../app/services/organizationApi";
import { useGetPermissionsQuery } from "../../../app/services/permissionsApi";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import styles from "./OrganizationDetail.module.css";

function OrganizationDetail() {
  const { id } = useParams();
  const { data: org, isLoading: isOrgLoading } =
    useGetOrganizationByIdQuery(id);
  const { data: permissions, isLoading: isPerLoading } =
    useGetPermissionsQuery();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "ADMIN",
    organizationId: id,
    permissions: [],
  });

  // Huquqlarni guruhlash (masalan: USER_READ -> USER)
  const groupPermissions = permissions?.reduce((acc, permission) => {
    const group = permission.split("_")[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(permission);
    return acc;
  }, {});

  // Bitta checkboxni o'zgartirish
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  };

  // Guruhdagi barcha checkboxlarni yoqish/o'chirish
  const toggleGroup = (groupName, isChecked) => {
    const groupItems = groupPermissions[groupName];
    setFormData((prev) => {
      let newPermissions;
      if (isChecked) {
        newPermissions = [...new Set([...prev.permissions, ...groupItems])];
      } else {
        newPermissions = prev.permissions.filter(
          (p) => !groupItems.includes(p),
        );
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yuborilayotgan ma'lumot: ", formData);
  };

  if (isOrgLoading || isPerLoading) return <FirstLoader />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{org?.name || "Tashkilot nomi"}</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <p className={styles.subtitle}>Huquqlar (Permissions)</p>

        <div className={styles.permissionsGrid}>
          {groupPermissions &&
            Object.keys(groupPermissions).map((group) => {
              const allChecked = groupPermissions[group].every((p) =>
                formData.permissions.includes(p),
              );

              return (
                <div key={group} className={styles.permissionGroup}>
                  <div className={styles.groupHeader}>
                    <h3 className={styles.groupTitle}>{group}</h3>
                    <label className={styles.selectAll}>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => toggleGroup(group, e.target.checked)}
                      />
                      <span>Hammasi</span>
                    </label>
                  </div>

                  <div className={styles.groupBody}>
                    {groupPermissions[group].map((el) => (
                      <label key={el} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          value={el}
                          checked={formData.permissions.includes(el)}
                          onChange={handleCheckboxChange}
                        />
                        <span className={styles.checkboxLabel}>
                          {el.includes("_")
                            ? el.split("_").slice(1).join("_")
                            : el}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Saqlash
        </button>
      </form>
    </div>
  );
}

export default OrganizationDetail;
