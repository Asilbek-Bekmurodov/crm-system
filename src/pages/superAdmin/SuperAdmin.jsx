import { superAdminMenu } from "../../../data/superAdmin";
import Dashboard from "../../layout/Dashboard/Dashboard";

function SuperAdmin() {
  // const state = useSelector((state) => state.auth);

  return <Dashboard menuData={superAdminMenu} />;
}
export default SuperAdmin;
