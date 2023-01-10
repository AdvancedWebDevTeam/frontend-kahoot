import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import EditRoleModal from "./EditRoleModal";
import Tag from "../../general/Tag";
import { getLoggedInUserId } from "../../../util/ultilis";
import DeleteButton from "../../general/DeleteButton";

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
        const isCurrentUser = member.userId === getLoggedInUserId();
        const hasLowerOrEqualRole = member.roleId <= currentUserRoleId;
        const canBeKicked = member.roleId > currentUserRoleId;
        const canBeEdited =
          canEditRole && !isCurrentUser && !hasLowerOrEqualRole;

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
              {canBeEdited && (
                <Button
                  size="sm"
                  className="button"
                  variant={canEditRole ? "outline-primary" : "outline-dark"}
                  onClick={() => openEditModal(member)}
                >
                  <BsPencilFill />
                </Button>
              )}
            </td>
            <td>
              {canBeKicked && (
                <DeleteButton
                  text={
                    <>
                      Are you sure you want to kick{" "}
                      <strong>{member.username}</strong>?
                    </>
                  }
                  onDelete={() => kick()}
                  size="sm"
                />
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
    const currentUserId = getLoggedInUserId();
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
    const currentUserId = getLoggedInUserId();
    if (userId === currentUserId) {
      return {
        backgroundColor: "#a3c2ff"
      };
    }
    return {};
  }

  return (
    <div className="member-list">
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
        close={() => closeEditModal()}
        changeRole={(userId, newRoleName) =>
          saveRoleChange(userId, newRoleName)
        }
        roles={roles}
      />
    </div>
  );
}

export default MemberList;
