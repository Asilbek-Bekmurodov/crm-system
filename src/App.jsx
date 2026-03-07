import { Route, Routes } from "react-router-dom";
import Public from "./pages/public/Public";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/NotFound/NotFound";
import SuperAdmin from "./pages/superAdmin/SuperAdmin";
import Admins from "./pages/superAdmin/Admins/Admins";
import Students from "./pages/superAdmin/Students/Student";
import All from "./pages/superAdmin/All/All";
import Teachers from "./pages/superAdmin/Teacher/Teachers";
import Administrator from "./pages/superAdmin/Administrator/Administrator";
import Organization from "./pages/superAdmin/Organization/Organization";
import Lessons from "./pages/teacher/Lessons/Lessons";
import Admin from "./pages/admin/Admin";
import Attendance from "./pages/admin/Attendance/Attendance";
import TeacherDashboard from "./pages/teacher/TeachersDashboard";
import Student from "./pages/admin/Student/Student";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Teacher from "./pages/admin/Teachers/Teachers";
import Finance from "./pages/admin/Finance/Finance";
import Notice from "./pages/admin/Notice/Notice";
import Calendar from "./pages/admin/Calendar/Calendar";
import Message from "./pages/admin/Message/Message";
import Profile from "./pages/admin/Profile/Profile";
import Settings from "./pages/admin/Settings/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/super-admin" element={<SuperAdmin />}>
          <Route index element={<All />} />
          {/* <Route path="admins" element={<Admins />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="administrators" element={<Administrator />} /> */}
          <Route path="organizations" element={<Organization />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/home" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />}>
          <Route index element={<Lessons />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="teacher" element={<Teacher />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="student" element={<Student />} />
          <Route path="dashboard" element={<Dashboard />} />n
          <Route path="finance" element={<Finance />} />
          <Route path="notice" element={<Notice />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="message" element={<Message />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
