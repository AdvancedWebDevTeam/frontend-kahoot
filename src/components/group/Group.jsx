import React from "react";
import { Route, Routes } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import GroupSideBar from "./GroupSideBar";
import MyGroup from "./MyGroup/MyGroup";
import GroupDetail from "./GroupDetail/GroupDetail";
import CreateGroup from "./CreateGroup/CreateGroup";

function Group() {
  return (
    <Container fluid="lg">
      <Row>
        <Col lg={3} sm={4} xs={5} style={{ backgroundColor: "green" }}>
          <GroupSideBar className="group-sidebar" />
        </Col>
        <Col lg={9} sm={8} xs={7} style={{ backgroundColor: "black" }}>
          <Routes className="group-body">
            <Route path="/" element={<MyGroup />} />
            <Route path=":groupId" element={<GroupDetail />} />
            <Route path="/create" element={<CreateGroup />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default Group;
