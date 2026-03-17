import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { HiOutlineLogout } from "react-icons/hi";
import { LayoutDashboard, Menu, X } from "lucide-react";
import ProfileIcon from "../../ui/ProfileIcon/ProfileIcon";
import { useDispatch } from "react-redux";
import { getOrgId, logOut } from "../../app/features/authSlice";
import { useGetMeQuery } from "../../app/services/userApi";

function Dashboard({ menuData }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { data: user, isLoading } = useGetMeQuery(undefined, {
    skip: !token || token === "undefined",
  });

  useEffect(() => {
    if (user?.organizationId) {
      dispatch(getOrgId(user.organizationId));
    }
  }, [dispatch, user?.organizationId]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/auth");
  };
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container}>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.topSide}>
          <div className={styles.yonma}>
            <div className={styles.iconWrapper}>
              <LayoutDashboard size={22} className={styles.icon} />
            </div>
            <span className={styles.logoText}>
              CRM<span className={styles.highlight}>System</span>
            </span>
            <button className={styles.closeBtn} onClick={toggleSidebar}>
              <X size={24} color="white" />
            </button>
          </div>

          <ul className={styles.menu}>
            {menuData.map(({ title, path }) => (
              <li key={path} className={styles.menuItem}>
                <NavLink
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bottomSide}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <HiOutlineLogout size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className={styles.profileIcon}>
            <h1 className={styles.title}>Dashboard</h1>
            <ProfileIcon user={user} isLoading={isLoading} />
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
