import React from "react";
import Dashboard from "../../layout/Dashboard/Dashboard";
import { adminMenu } from "../../../data/Admin";

function Admin() {
  return <Dashboard menuData={adminMenu} />;
}

export default Admin;
