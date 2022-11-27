import React, { useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import EditRoleModal from "./EditRoleModal";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

function MemberList({ members, groupId, changeMemberRole, roles }) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState({});
  const [canEditRole, setCanEditRole] = React.useState(true);

  useEffect(() => {
    const currentUserId = getUserId();
    const currentUser = members.find(
      (member) => member.userId === currentUserId
    );
    setCanEditRole(
      currentUser?.roleId === 1 || currentUser?.roleId === 2
    );
  }, [members]);

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

  function rowNeedHighlight(userId) {
    const currentUserId = getUserId();
    if (userId === currentUserId) {
      return {
        backgroundColor: "#a3c2ff"
      };
    }
    return {};
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
          {members.map((member) => {
            const highlightStyle = rowNeedHighlight(member.userId);
            return (
              <tr key={member.userId} style={highlightStyle}>
                <td>{member.userId}</td>
                <td>{member.username}</td>
                <td>{member.email}</td>
                <td>{member.roleName}</td>
                <td>
                  <Button
                    size="sm"
                    className="button"
                    variant={canEditRole ? "outline-primary" : "outline-dark"}
                    onClick={() => openEditModal(member)}
                    disabled={!canEditRole}
                  >
                    <BsPencilFill />
                  </Button>
                </td>
              </tr>
            );
          })}
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
