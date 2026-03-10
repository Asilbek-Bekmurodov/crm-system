import styles from "./CreateAdmin.module.css";

function CreateAdmin({
  org,
  handleSubmit,
  formData,
  handleInputChange,
  groupedPermissions,
  handleGroupChange,
  isCreating,
  handleCheckboxChange,
}) {
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
              autoComplete="current-password"
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
export default CreateAdmin;
