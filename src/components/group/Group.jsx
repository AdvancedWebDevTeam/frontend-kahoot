import React, { useEffect } from "react";
import { Col, Tab, Row } from "react-bootstrap";
import MyGroup from "./MyGroup/MyGroup";
import CreateGroup from "./CreateGroup/CreateGroup";
import { getGroupsOfUser } from "../../fetch/groupFetch";
import GroupSideBar from "./GroupSideBar";
import "./group.css";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

function Group() {
  const [groups, setGroups] = React.useState([]);

  useEffect(() => {
    const userId = getUserId();
    getGroupsOfUser(userId).then((data) => {
      setGroups(data);
    });
  }, []);

  return (
    <div className="group-container">
      <Tab.Container
        fluid="lg"
        id="list-group-tabs"
        defaultActiveKey="my-groups"
      >
        <Row>
          <Col lg={2} sm={3} xs={4} style={{ backgroundColor: "green" }}>
            <GroupSideBar groups={groups} />
          </Col>
          <Col lg={10} sm={9} xs={8} style={{ backgroundColor: "yellowgreen" }}>
            <Tab.Content className="group-body">
              <Tab.Pane eventKey="create">
                <CreateGroup />
              </Tab.Pane>
              <Tab.Pane eventKey="my-groups">
                <MyGroup />
              </Tab.Pane>
              {groups.map((group) => (
                <Tab.Pane key={group.groups_id} eventKey={group.groups_id}>
                  <h1>{group.groups_name}</h1>
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
