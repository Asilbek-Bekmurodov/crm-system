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
import Administrator from "./pages/superAdmin/Administrator/Administrator";
import Organization from "./pages/superAdmin/Organization/Organization";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/super-admin" element={<SuperAdmin />}>
          <Route index element={<All />} />
          <Route path="admins" element={<Admins />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="administrators" element={<Administrator />} />
          <Route path="organizations" element={<Organization />} />
        </Route>

        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
