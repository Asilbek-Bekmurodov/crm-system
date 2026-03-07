import React from "react";
import Dashboard from "../../layout/Dashboard/Dashboard";
import { administratorMenuData } from "../../../data/Administrator/Administrator";

function Administrator() {
  return <Dashboard menuData={administratorMenuData} />;
}

export default Administrator;