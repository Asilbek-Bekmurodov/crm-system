import { useGetSubjectsQuery } from "../../../app/services/subjectsApi";
import { useGetUserQuery } from "../../../app/services/userApi";
import styles from "./CreateGroups.module.css";
function CreateGroup({
  handleSubmit,
  formData,
  handleInputChange,
  isCreating,
  isEditing,
}) {
  const {
    data: teachers,
    isLoading: isTeacherLoading,
    isError: isErrorTeacher,
  } = useGetUserQuery("teachers");
  const {
    data: subjects,
    isLoading: isSubjectLoading,
    isError: isErrorSubject,
  } = useGetSubjectsQuery("subjects");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.subtitle}>
          {isEditing
            ? "Guruh ma'lumotlarini tahrirlang"
            : "Yangi guruh yarating va unga o'qituvchi hamda fan biriktiring"}
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
              placeholder="group name"
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
          <div className={styles.inputGroup}>
            <label className={styles.label}>Price</label>
            <input
              name="price"
              className={styles.inputField}
              type="number"
              required
              placeholder="price"
              value={formData.price ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>lessonStartTime</label>
            <input
              name="lessonStartTime"
              className={styles.inputField}
              type="string"
              required
              placeholder="lessonStartTime"
              value={formData.lessonStartTime ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="teacher" className={styles.label}>
              O'qituvchini tanlang
            </label>
            {isErrorTeacher && <span>Teacher yuklashda xatolik bo'ldi</span>}

            <select
              className={styles.inputField}
              onChange={handleInputChange}
              name="teacherId"
              id="teacher"
              value={formData.teacherId ?? ""}
            >
              <option value="">Tanlang</option>
              {isTeacherLoading && (
                <option value="" disabled>
                  Teachers yuklanyapti
                </option>
              )}
              {teachers?.content &&
                teachers?.content.map(({ firstname, lastname, id }) => (
                  <option key={id} value={id}>
                    {firstname} {lastname}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="subjects" className={styles.label}>
              Fanni Tanlang
            </label>
            {isErrorSubject && <span>Fan yuklashda xatolik bo'ldi</span>}
            <select
              className={styles.inputField}
              onChange={handleInputChange}
              name="subjectId"
              id="subjects"
              value={formData.subjectId ?? ""}
            >
              <option value="">Tanlang</option>

              {isSubjectLoading && (
                <option value="" disabled>
                  Fan yuklanyapti
                </option>
              )}

              {subjects &&
                subjects.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isCreating}
          >
            {isCreating ? "Saqlanmoqda..." : "Groupni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateGroup;
