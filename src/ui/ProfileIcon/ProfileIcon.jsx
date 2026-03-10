import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../app/services/userApi";
import styles from "./ProfileIcon.module.css";
import defaultImg from "../../assets/1.jpg";

function ProfileIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { data: user } = useGetMeQuery();

  // Menyudan tashqariga bosilganda yopish funksiyasi
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className={styles.profileRoot} ref={dropdownRef}>
      <div className={styles.triggerButton} onClick={toggleMenu}>
        <img src={user?.profilePictureUrl || defaultImg} alt="User" />
        <span className={styles.arrowIcon}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <img
              src={user?.profilePictureUrl || defaultImg}
              className={styles.miniAvatar}
              alt="User"
            />
            <div className={styles.info}>
              <h4>
                {user?.firstname} {user?.lastname}
              </h4>
              <p>{user?.username}</p>
            </div>
          </div>

          <div className={styles.menuList}>
            <div
              className={styles.menuItem}
              onClick={() => handleNavigate("/profile")}
            >
              My Profile
            </div>
            <div className={styles.menuItem}>Account settings</div>
            <div className={styles.divider}></div>
            <div className={`${styles.menuItem} ${styles.logout}`}>Log out</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
