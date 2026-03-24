import React from "react";
import styles from "./CreateTimeTable.module.css";
import { useGetGroupsQuery } from "../../../app/services/groupsApi";

const DAYS_OPTIONS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function CreateTimeTable({
  formData,
  handleInputChange,
  handleDayChange,
  handleSubmit,
  isCreating,
  isEditing,
  orgId,
}) {
  const { data: groups, isLoading: groupsLoading } = useGetGroupsQuery(
    { query: "groups", organizationId: `${orgId}&size=1000` },
    { skip: !orgId }
  );

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGrid}>
          <div className={styles.inputGroupFull}>
            <label className={styles.label}>Select Group</label>
            <select
              name="groupId"
              className={styles.inputField}
              value={formData.groupId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Group</option>
              {groups?.content?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
             </select>
           </div>
 
           {!isEditing && (
             <div className={styles.inputGroupFull}>
               <label className={styles.label}>Days of the week</label>
               <div className={styles.daysGrid}>
                 {DAYS_OPTIONS.map((day) => (
                   <label key={day} className={styles.dayCheckbox}>
                     <input
                       type="checkbox"
                       checked={formData.daysOfWeek.includes(day)}
                       onChange={() => handleDayChange(day)}
                     />
                     <span>{day}</span>
                   </label>
                 ))}
               </div>
             </div>
           )}
 
           <div className={styles.inputGroup}>
             <label className={styles.label}>Start Time</label>
             <input
               type="time"
               name="startTime"
               className={styles.inputField}
               value={formData.startTime}
               onChange={handleInputChange}
               required
             />
           </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>End Time</label>
            <input
              type="time"
              name="endTime"
              className={styles.inputField}
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroupFull}>
            <label className={styles.label}>Room</label>
            <input
              type="text"
              name="room"
              className={styles.inputField}
              placeholder="e.g., 404"
              value={formData.room}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isCreating}
          >
            {isCreating ? "Saving..." : isEditing ? "Edit" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTimeTable;
