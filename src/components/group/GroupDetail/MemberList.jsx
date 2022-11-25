import React from "react";
import { Button, Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";

function MemberList({ members, groupId }) {
  return (
    <div className="member-list">
      <h2 className="title">Danh sách thành viên</h2>
      <Table striped>
        <thead>
          <th>#</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.users_id}>
              <td>{member.users_id}</td>
              <td>{member.users_name}</td>
              <td>{member.email}</td>
              <td>{member.users_id}</td>
              <td>
                <Button size="sm" className="button">
                  <BsPencilFill />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default MemberList;
