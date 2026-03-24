import React, { useMemo } from "react";
import styles from "./Dashboard.module.css";
import { useGetUserQuery } from "../../../app/services/userApi";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight,
  PlusCircle,
  FileText,
  Calendar as CalendarIcon
} from "lucide-react";
import FirstLoader from "../../../ui/FirstLoader/FirstLoader";
import { Link } from "react-router-dom";

function StatCard({ label, value, icon: Icon, type, isLoading }) {
  return (
    <div className={`${styles.statCard} ${styles[type]}`}>
      <div className={styles.cardIcon}>
        <Icon size={24} />
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardLabel}>{label}</p>
        <h2 className={styles.cardValue}>
          {isLoading ? "..." : value}
        </h2>
      </div>
      <Icon className={styles.cardBgIcon} />
    </div>
  );
}

function Dashboard() {
  const { data: allUsersData, isLoading: uLoading } = useGetUserQuery("users");

  const counts = useMemo(() => {
    const list = allUsersData?.content || allUsersData || [];
    return {
      teachers: list.filter(u => u.role === "TEACHER").length,
      students: list.filter(u => u.role === "STUDENT").length,
      administrators: list.filter(u => u.role === "ADMINISTRATOR" || u.role === "ADMIN").length,
      admins: list.filter(u => u.role === "ADMIN").length // Just as a separate stat if needed
    };
  }, [allUsersData]);

  const stats = [
    {
      label: "O'qituvchilar",
      value: counts.teachers,
      icon: GraduationCap,
      type: "teachers",
      loading: uLoading
    },
    {
      label: "Talabalar",
      value: counts.students,
      icon: Users,
      type: "students",
      loading: uLoading
    },
    {
      label: "Administratorlar",
      value: counts.administrators,
      icon: ShieldCheck,
      type: "administrators",
      loading: uLoading
    },
    {
      label: "Adminlar",
      value: counts.admins, 
      icon: UserPlus,
      type: "admins",
      loading: uLoading
    }
  ];

  const quickActions = [
    { label: "Yangi O'qituvchi", icon: PlusCircle, path: "/admin/teachers", color: "#6366f1" },
    { label: "Yangi Talaba", icon: PlusCircle, path: "/admin/students", color: "#10b981" },
    { label: "Dars Jadvali", icon: CalendarIcon, path: "/admin/calendar", color: "#f59e0b" },
    { label: "Hisobotlar", icon: FileText, path: "/admin/finance", color: "#f43f5e" }
  ];

  if (uLoading) {
    return <FirstLoader />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            <LayoutDashboard size={28} inline style={{ marginBottom: -4, marginRight: 12 }} />
            Boshqaruv Paneli
          </h1>
          <p className={styles.headerSubtitle}>Tizimning umumiy holati va tezkor harakatlar</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            type={stat.type}
            isLoading={stat.loading}
          />
        ))}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.quickActionsSection}>
          <h2 className={styles.sectionTitle}>Tezkor Harakatlar</h2>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, idx) => (
              <Link to={action.path} key={idx} className={styles.actionCard}>
                <div className={styles.actionIcon} style={{ background: `${action.color}15`, color: action.color }}>
                  <action.icon size={20} />
                </div>
                <span className={styles.actionLabel}>{action.label}</span>
                <ArrowRight size={16} className={styles.arrow} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
