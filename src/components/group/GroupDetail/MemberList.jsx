import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import EditRoleModal from "./EditRoleModal";

function MemberList({ members, groupId, changeMemberRole, roles }) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState({});

  function openEditModal(member) {
    setEditingMember(member);
    setShowEditModal(true);
  }

  function closeEditModal() {
    setShowEditModal(false);
  }

  function saveRoleChange(userId, newRoleName) {
    changeMemberRole(userId, newRoleName);
    closeEditModal();
  }

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
            <tr key={member.userId}>
              <td>{member.userId}</td>
              <td>{member.username}</td>
              <td>{member.email}</td>
              <td>{member.roleName}</td>
              <td>
                <Button
                  size="sm"
                  className="button"
                  variant="outline-primary"
                  onClick={() => openEditModal(member)}
                >
                  <BsPencilFill />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <EditRoleModal
        show={showEditModal}
        groupId={groupId}
        member={editingMember}
        close={closeEditModal}
        changeRole={saveRoleChange}
        roles={roles}
      />
    </div>
  );
}

export default MemberList;
