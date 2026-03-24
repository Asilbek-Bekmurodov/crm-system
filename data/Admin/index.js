export let adminMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "Teacher",
    path: "/admin/teachers",
  },
  {
    title: "Student",
    path: "/admin/students",
  },
  {
    title: "Administrator",
    path: "/admin/administrators",
  },
  {
    title: "Attendance",
    path: "/admin/attendance",
  },
  {
    title: "Finance",
    path: "/admin/finance",
  },
  {
    title: "Notice",
    path: "/admin/notice",
  },
  {
    title: "Calendar",
    path: "/admin/calendar",
  },
  {
    title: "Message",
    path: "/admin/message",
  },
  // {
  //   title: "Profile",
  //   path: "/admin/profile",
  // },
  {
    title: "Settings",
    path: "/admin/settings",
  },
  {
    title: "Groups",
    path: "/admin/groups",
  },
  {
    title: "Subject",
    path: "/admin/subject",
  },
];

export const TeacherTableHeaders = [
  "T/r",
  "O'qituvchi",
  "Yoshi",
  "Jinsi",
  "Guruhlar",
  "Rol",
  "Edit",
  "Delete",
];

export const StudentTableHeaders = [
  "T/r",
  "FirsName",
  "LastName",
  "Age",
  "Gender",
  "Guruh",
  "Tel Raqam",
  "Username",
  "Role",
  "Edit",
  "Delete",
];

export const AdministratorTableHeaders = [
  "T/r",
  "FirsName",
  "LastName",
  "Age",
  "Gender",
  "Username",
  "Role",
  "Edit",
  "Delete",
];

export const GroupTableHeaders = [
  "T/r",
  "id",
  "name",
  "description",
  "subjectName",
  "teacherName",
  "price",
  "lessonStartTime",
  "Edit",
  "Delete",

];

export const SubjectTableHeaders = [
  "T/r",
  "name",
  "description",
  "Edit",
  "Delete",
  "Open",
];

export const SubjectTopicTableHeaders = [
  "T/R",
  "name",
  "description",
  "orderNumber",
  "Edit",
  "Delete",
  "Open",
];
