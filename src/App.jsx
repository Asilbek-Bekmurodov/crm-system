import { Route, Routes } from "react-router-dom";
import Public from "./pages/public/Public";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/NotFound/NotFound";
import SuperAdmin from "./pages/superAdmin/SuperAdmin";
import Admins from "./pages/superAdmin/Admins/Admins";
import Students from "./pages/superAdmin/Students/Students";
import All from "./pages/superAdmin/All/All";
import Teachers from "./pages/superAdmin/Teachers/Teachers";
import Organization from "./pages/superAdmin/Organization/Organization";
import Teacher from "./pages/teacher/Teacher";
import Lessons from "./pages/teacher/Lessons/Lessons";
import Profile from "./layout/Profile/Profile";
import Administrator from "./pages/administrator/Administrator";
import Student from "./pages/student/Student";
import Subject from "./pages/student/Subject/Subject";
import Settings from "./layout/Settings/Settings";
import Coursemanagement from "./pages/administrator/Coursemanagement/Coursemanagement";
import Homes from "./pages/administrator/Home/Home";
import Studentmanagement from "./pages/administrator/Studentmanagement/Studentmanagement";
import Examandover from "./pages/administrator/Examandover/Examandover";
import Scheduleandplan from "./pages/administrator/Scheduleandplan/Scheduleandplan";
import MessagesandNotifications from "./pages/administrator/MessagesandNotifications/MessagesandNotifications";
import Reports from "./pages/administrator/Reports/Reports";
import Settingss from "./pages/administrator/Settings/Settings";

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
        <Route path="/teacher" element={<Teacher />}>
          <Route index element={<Lessons />} />
        </Route>
        <Route path="/administrator" element={<Administrator />}>
          <Route path="home" element={<Homes />} />   
          <Route path="darsboshqaruvi" element={<Coursemanagement />} />
          <Route path="talababoshqaruv" element={<Studentmanagement/>}/>
          <Route path="imtihonbaholash" element={<Examandover/>}/>
          <Route path="jadvalreja" element={<Scheduleandplan/>}/>
          <Route path="xabarvabildirishnoma" element={<MessagesandNotifications/>}/>
          <Route path="hisobotlar" element={<Reports/>}/>
          <Route path="sozlamalar" element={<Settingss/>}/>
        </Route>
        <Route path="/student" element={<Student />}>
          <Route index element={<Subject />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
