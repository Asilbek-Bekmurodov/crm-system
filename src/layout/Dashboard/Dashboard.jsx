import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";

function Dashboard({ menuData }) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>PDP Admin</h2>

        <ul className={styles.menu}>
          {menuData.map(({ title, path }) => (
            <li key={path} className={styles.menuItem}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
