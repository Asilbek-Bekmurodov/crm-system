import React from "react";
import Dashboard from "../../layout/Dashboard/Dashboard";
import { studentMenuData } from "../../../data/Student/Student";

function Student() {
  return <Dashboard menuData={studentMenuData} />;
}

export default Student;
