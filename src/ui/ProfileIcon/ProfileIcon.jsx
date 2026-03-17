import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../app/services/userApi";
import styles from "./ProfileIcon.module.css";
const BASE_URL = "https://crmsystem-production-d4ee.up.railway.app";
const DEFAULT_AVATAR = "/default-avatar.png";

function ProfileIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const avatarSrc = user?.profilePictureUrl
    ? `${BASE_URL}${user.profilePictureUrl}`
    : DEFAULT_AVATAR;

  if (isLoading) return <div className={styles.loader}>...</div>;

  return (
    <div className={styles.profileRoot} ref={dropdownRef}>
      <div className={styles.triggerButton} onClick={toggleMenu}>
        <img
          src={avatarSrc}
          alt="User"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
          className={styles.mainAvatar}
        />
        <span className={styles.arrowIcon}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <img
              src={avatarSrc}
              className={styles.miniAvatar}
              alt="User"
              onError={(e) => {
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div className={styles.info}>
              <h4>
                {user?.firstname} {user?.lastname}
              </h4>
              <p>@{user?.username || "username"}</p>
            </div>
          </div>

          <div className={styles.menuList}>
            <div
              className={styles.menuItem}
              onClick={() => handleNavigate("/profile")}
            >
              Mening profilim
            </div>
            <div
              className={styles.menuItem}
              onClick={() => handleNavigate("/settings")}
            >
              Sozlamalar
            </div>
            <div className={styles.divider}></div>
            <div
              className={`${styles.menuItem} ${styles.logout}`}
              onClick={handleLogout}
            >
              Chiqish
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
