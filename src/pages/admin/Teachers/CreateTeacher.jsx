import React, { useState } from "react";
import styles from "./CreateTeacher.module.css";
import { Eye, EyeOff, Camera, X, Check, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

function CreateTeacher({
  handleSubmit,
  formData,
  handleInputChange,
  groupedPermissions,
  handleGroupChange,
  isCreating,
  handleCheckboxChange,
  groups,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGroupToggle = (groupId) => {
    const currentGroups = formData.enrolledGroupIds || [];
    const isSelected = currentGroups.includes(groupId);
    const newGroups = isSelected
      ? currentGroups.filter((id) => id !== groupId)
      : [...currentGroups, groupId];
    
    handleInputChange({
      target: { name: "enrolledGroupIds", value: newGroups },
    });
  };


  const removeGroup = (groupId) => {
    const newGroups = (formData.enrolledGroupIds || []).filter(id => id !== groupId);
    handleInputChange({
      target: { name: "enrolledGroupIds", value: newGroups },
    });
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.subtitle}>
          Yangi teacher yaratish va huquqlarni biriktirish
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.topSection}>

          <div className={styles.mainInfoGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Foydalanuvchi nomi (Username)</label>
              <input
                name="username"
                className={styles.inputField}
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder="username"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Ismi</label>
              <input
                name="firstname"
                className={styles.inputField}
                type="text"
                required
                placeholder="firstname"
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
                placeholder="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Parol</label>
              <div className={styles.passwordWrapper}>
                <input
                  name="password"
                  className={styles.inputField}
                  type={showPassword ? "text" : "password"}
                  required={!formData.id} // Edit rejimida majburiy emas
                  placeholder="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Yoshi (Age)</label>
              <input
                name="age"
                className={styles.inputField}
                type="number"
                required
                placeholder="25"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Jinsi (Gender)</label>
              <select
                name="gender"
                className={styles.inputField}
                required
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="MALE">Erkak</option>
                <option value="FEMALE">Ayol</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.extraDetails}>
           <div className={styles.inputGroup}>
            <label className={styles.label}>Guruhlarni biriktirish</label>
            <div className={styles.multiSelectContainer}>
              <div 
                className={styles.selectTrigger} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {formData.enrolledGroupIds?.length > 0 ? (
                  <div className={styles.selectedTags}>
                    {formData.enrolledGroupIds.map((id) => {
                      const group = groups.find(g => g.id === id);
                      return (
                        <span key={id} className={styles.tag}>
                          {group?.name || id}
                          <X 
                            size={14} 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGroup(id);
                            }} 
                          />
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className={styles.placeholder}>Guruhlarni tanlang...</span>
                )}
                <div className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ""}`}></div>
              </div>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu} ref={dropdownRef}>
                  <div className={styles.dropdownHeader}>
                    <span>Guruhni tanlang</span>
                    <button 
                      type="button" 
                      className={styles.closeDropdownBtn}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                  <div className={styles.dropdownList}>
                    {groups && groups.length > 0 ? (
                      groups.map((group) => {
                        const isSelected = formData.enrolledGroupIds?.includes(group.id);
                        return (
                          <div 
                            key={group.id} 
                            className={`${styles.dropdownItem} ${isSelected ? styles.itemSelected : ""}`}
                            onClick={() => handleGroupToggle(group.id)}
                          >
                            <div className={styles.itemContent}>
                              <span className={styles.itemName}>{group.name}</span>
                              <span className={styles.itemSubject}>{group.subjectName}</span>
                            </div>
                            {isSelected && <Check size={16} className={styles.checkIcon} />}
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.noData}>Guruhlar topilmadi</div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                          {el.replaceAll("_", " ")}
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
            {isCreating ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateTeacher;
