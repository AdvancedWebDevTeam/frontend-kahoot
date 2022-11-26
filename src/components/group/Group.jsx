import React, { useEffect } from "react";
import { Col, Tab, Row } from "react-bootstrap";
  import CreateGroup from "./CreateGroup/CreateGroup";
import { getGroupsOfUser } from "../../fetch/groupFetch";
import GroupSideBar from "./GroupSideBar";
import "./group.css";
import GroupDetail from "./GroupDetail/GroupDetail";
import {getAllAvailableRoles} from "../../fetch/roleFetch";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

function Group() {
  const [groups, setGroups] = React.useState([]);
  const [availableRoles, setAvailableRoles] = React.useState([]);

  useEffect(() => {
    const userId = getUserId();
    getGroupsOfUser(userId).then((data) => {
      setGroups(data);
    });
    getAllAvailableRoles().then((roles) => {
      setAvailableRoles(roles);
    });
  }, []);

  return (
    <div className="group-container">
      <Tab.Container
        fluid="lg"
        id="list-group-tabs"
        defaultActiveKey={groups.length > 0 ? groups[0].groups_id : "create"}
      >
        <Row>
          <Col lg={2} sm={3} xs={4}>
            <GroupSideBar groups={groups} />
          </Col>
          <Col lg={6} sm={9} xs={8}>
            <Tab.Content className="group-body">
              <Tab.Pane eventKey="create">
                <CreateGroup />
              </Tab.Pane>
              <Tab.Pane eventKey="my-groups" />
              {groups.map((group) => (
                <Tab.Pane key={group.groups_id} eventKey={group.groups_id}>
                  <GroupDetail group={group} roles={availableRoles} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default Group;
