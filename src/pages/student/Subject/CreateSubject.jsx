import styles from "./CreateSubject.module.css";

function CreateSubject({
  handleSubmit,
  formData,
  handleInputChange,
  isCreating,
  isEditing,
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.subtitle}>
          {isEditing
            ? "Fan ma'lumotlarini tahrirlang"
            : "Yangi fan yarating"}
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Group name</label>
            <input
              name="name"
              className={styles.inputField}
              type="text"
              required
              value={formData.name ?? ""}
              onChange={handleInputChange}
              placeholder="Group name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <input
              name="description"
              className={styles.inputField}
              type="text"
              required
              placeholder="Description"
              value={formData.description ?? ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isCreating}
          >
            {isCreating ? "Loading..." : "Save group"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSubject;
