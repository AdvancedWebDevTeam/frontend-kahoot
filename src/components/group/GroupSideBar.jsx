import React from "react";
import { Card, Nav } from "react-bootstrap";
import "./group.css";
import { capitalizeFirstLetter } from "../../util/ultilis";

function GroupSideBar({ groups }) {
  return (
    <Card className="group-sidebar">
      <Nav variant="pills">
        <Nav.Item>
          <Nav.Link eventKey="create">Create New Group</Nav.Link>
          <Nav.Link eventKey="join">Invite User to Group</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="my-groups" disabled>
            ⬇ My Group
          </Nav.Link>
        </Nav.Item>
        {groups.map((group) => (
          <Nav.Item key={group.groups_id}>
            <Nav.Link eventKey={group.groups_id}>
              {capitalizeFirstLetter(group.groups_name)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Card>
  );
}

export default GroupSideBar;
