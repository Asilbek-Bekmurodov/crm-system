import styles from "./CreateSubject.module.css";

function CreateTopic({
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
            ? "Mavzu ma'lumotlarini tahrirlang"
            : "Yangi mavzu yarating"}
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <input
              name="name"
              className={styles.inputField}
              type="text"
              required
              value={formData.name ?? ""}
              onChange={handleInputChange}
              placeholder="Name"
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
          {/* <div className={styles.inputGroup}>
            <label className={styles.label}>Order Number</label>
            <input
              name="orderNumber"
              className={styles.inputField}
              type="number"
              required
              placeholder="Order Number"
              value={formData.orderNumber ?? ""}
              onChange={handleInputChange}
            />
          </div> */}
        </div>

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isCreating}
          >
            {isCreating ? "Yuklanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTopic;
