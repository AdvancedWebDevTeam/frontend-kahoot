import React from "react";
import { Outlet } from "react-router-dom";
import GroupSideBar from "./GroupSideBar";

function Group() {
  return (
    <div>
      <GroupSideBar />
      <Outlet />
    </div>
  );
}

export default Group;
