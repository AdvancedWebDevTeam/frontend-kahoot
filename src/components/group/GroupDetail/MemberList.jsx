import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import EditRoleModal from "./EditRoleModal";
import Tag from "../../general/Tag";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

function getTbody(
  members,
  rowNeedHighlight,
  canEditRole,
  openEditModal,
  currentUserRoleId,
  kickMember
) {
  return (
    <>
      {members.map((member) => {
        const highlightStyle = rowNeedHighlight(member.userId);
        const tagVariant =
          member.roleId === 1
            ? "success"
            : member.roleId === 2
            ? "warning"
            : null;
        const isCurrentUser = member.userId === getUserId();
        const hasLowerRole = member.roleId < currentUserRoleId;
        const canBeKicked = member.roleId > 2 && currentUserRoleId <= 2;

        function kick() {
          kickMember(member.userId);
        }

        return (
          <tr key={member.userId} style={highlightStyle}>
            <td>{member.userId}</td>
            <td>{member.username}</td>
            <td>{member.email}</td>
            <td>
              <Tag variant={tagVariant}>{member.roleName}</Tag>
            </td>
            <td>
              <Button
                size="sm"
                className="button"
                variant={canEditRole ? "outline-primary" : "outline-dark"}
                onClick={() => openEditModal(member)}
                disabled={!canEditRole || isCurrentUser || hasLowerRole}
              >
                <BsPencilFill />
              </Button>
            </td>
            <td>
              {canBeKicked && (
                <Button
                  size="sm"
                  className="button"
                  variant="outline-danger"
                  onClick={kick}
                >
                  <BsFillTrashFill />
                </Button>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}

function MemberList({ members, groupId, changeMemberRole, roles, kickMember }) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState({});
  const [canEditRole, setCanEditRole] = React.useState(true);
  const [currentUserRoleId, setCurrentUserRoleId] = React.useState(0);

  useEffect(() => {
    const currentUserId = getUserId();
    const currentUser = members.find(
      (member) => member.userId === currentUserId
    );
    setCurrentUserRoleId(currentUser?.roleId);
    setCanEditRole(currentUser?.roleId === 1 || currentUser?.roleId === 2);
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

  function kick(userId) {
    kickMember(userId);
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
          {getTbody(
            members,
            rowNeedHighlight,
            canEditRole,
            openEditModal,
            currentUserRoleId,
            kick
          )}
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
