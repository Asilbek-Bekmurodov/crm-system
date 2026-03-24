import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { HiOutlineLogout } from "react-icons/hi";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  ClipboardCheck, 
  Wallet, 
  Bell, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Settings, 
  Users2, 
  BookOpen, 
  Menu, 
  X 
} from "lucide-react";
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
    if (user?.organizationId !== undefined && user?.organizationId !== null) {
      dispatch(getOrgId(user.organizationId));
    }
  }, [dispatch, user?.organizationId]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/auth");
  };
  const toggleSidebar = () => setIsOpen(!isOpen);

  const iconMap = {
    Dashboard: <LayoutDashboard size={20} />,
    Teacher: <Users size={20} />,
    Student: <GraduationCap size={20} />,
    Administrator: <ShieldCheck size={20} />,
    Attendance: <ClipboardCheck size={20} />,
    Finance: <Wallet size={20} />,
    Notice: <Bell size={20} />,
    Calendar: <CalendarIcon size={20} />,
    Message: <MessageSquare size={20} />,
    Settings: <Settings size={20} />,
    Groups: <Users2 size={20} />,
    Subject: <BookOpen size={20} />,
  };

  return (
    <div className={styles.container}>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.topSide}>
          <div className={styles.logoSection}>
            <div className={styles.logoBadge}>
              <div className={styles.logoIconInner}>
                <div className={styles.dot}></div>
              </div>
            </div>
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoMain}>CRM</span>
              <span className={styles.logoSub}>SYSTEM</span>
            </div>
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
                  <span className={styles.menuIcon}>{iconMap[title] || <LayoutDashboard size={20} />}</span>
                  <span className={styles.menuTitle}>{title}</span>
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
