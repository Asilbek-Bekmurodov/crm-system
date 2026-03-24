import React from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, LogOut as LogOutIcon, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import styles from "./Profile.module.css";
import { useGetMeQuery } from "../../../app/services/userApi";
import { profileMenu } from "../../../../data/Profile/Profile";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logOut } from "../../../app/features/authSlice";

const BASE_URL = "https://crmsystem-production-d4ee.up.railway.app";
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token || token === "undefined",
  });

  const handleBack = () => {
    const userRole = user?.role?.toUpperCase();
    if (userRole) {
      const rolePaths = {
        SUPER_ADMIN: "/super-admin",
        ADMIN: "/admin",
        ADMINISTRATOR: "/administrator",
        TEACHER: "/teacher",
        STUDENT: "/student",
      };
      const targetPath = rolePaths[userRole];
      targetPath ? navigate(targetPath) : navigate(-1);
    } else {
      navigate(-1);
    }
  };

  const getAvatarSrc = () => {
    if (user?.profilePictureUrl) {
      return `${user.profilePictureUrl}`;
    }
    return DEFAULT_AVATAR;
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.loaderContent}>
          <Loader2 className={styles.spinnerIcon} size={50} />
          <p>Profilingiz yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError || (!user && !isLoading)) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.loaderContent}>
          <p>Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Qayta kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />

      <aside className={styles.sidebar}>
        <div className={styles.profileBox}>
          <div className={styles.avatarWrapper}>
            <img
              key={user?.profilePictureUrl}
              src={getAvatarSrc()}
              alt="profile"
              className={styles.sidebarAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div className={styles.activeStatus}></div>
          </div>
          <h3 className={styles.userName}>
            {user?.firstname} {user?.lastname}
          </h3>
          <p className={styles.userEmail}>@{user?.username}</p>
        </div>

        <nav className={styles.navMenu}>
          <ul className={styles.menu}>
            {profileMenu.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.menuItem} ${styles.active}`
                        : styles.menuItem
                    }
                  >
                    <Icon size={18} /> {item.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <HiOutlineLogout size={20} />
              <span>Chiqish</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className={styles.content}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeft size={18} /> Asosiy panelga qaytish
          </button>
        </div>

        <div className={styles.dynamicWrapper}>
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}

export default Profile;
