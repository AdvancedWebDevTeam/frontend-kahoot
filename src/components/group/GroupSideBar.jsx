import React from "react";
import { Link } from "react-router-dom";

function GroupSideBar() {
  return (
    <div style={{ backgroundColor: "red" }}>
      <ul>
        <li>
          <Link to="create">Create New Group</Link>
        </li>
        <li>
          <Link to="">My Group</Link>
        </li>
      </ul>
    </div>
  );
}

export default GroupSideBar;
