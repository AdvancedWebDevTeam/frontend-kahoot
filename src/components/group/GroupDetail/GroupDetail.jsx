import React, { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MemberList from "./MemberList";
import {
  getMembersInGroup,
  requestDeleteGroup,
  requestKickMember
} from "../../../fetch/groupFetch";
import {
  capitalizeFirstLetter,
  getLoggedInUserId
} from "../../../util/ultilis";
import "./groupDetail.css";
import { requestMemberRoleChange } from "../../../fetch/roleFetch";
import DeleteButton from "../../general/DeleteButton";

function GroupDetail({ group, roles, onDeleteGroup }) {
  const [members, setMembers] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSuccess, setAlertSuccess] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMembersInGroup(group.groups_id).then((data) => {
      setMembers(data);
    });
  }, []);

  const viewPresentClick = () => {
    navigate(`/presentations/${group.groups_id}`);
  };

  function changeMemberRole(userId, newRoleName) {
    const { roles_id } = roles.find((role) => role.roles_name === newRoleName);
    const newMembers = members.map((member) => {
      if (member.userId === userId) {
        return {
          ...member,
          roleId: roles_id,
          roleName: newRoleName
        };
      }
      return member;
    });
    setMembers(newMembers);

    requestMemberRoleChange(group.groups_id, userId, roles_id)
      .then((success) => {
        if (success) {
          setShowAlert(true);
          setAlertSuccess(true);
          setAlertMessage("Role changed successfully");
        }
      })
      .catch(() => {
        setShowAlert(true);
        setAlertSuccess(false);
        setAlertMessage("Failed to change role");
      });
  }

  function kickMember(memberId) {
    const newMembers = members.filter((member) => member.userId !== memberId);
    setMembers(newMembers);

    requestKickMember(group.groups_id, memberId)
      .then((success) => {
        if (success) {
          setShowAlert(true);
          setAlertSuccess(true);
          setAlertMessage("Member has been kicked!");
        }
      })
      .catch(() => {
        setShowAlert(true);
        setAlertSuccess(false);
        setAlertMessage("Failed to kick member");
      });
  }

  function canDeleteGroup() {
    return members.some(
      (member) => member.userId === getLoggedInUserId() && member.roleId === 1
    );
  }

  async function removeGroup() {
    await requestDeleteGroup(group.groups_id);
    onDeleteGroup(group.groups_id);
  }

  const alert = (
    <Alert
      dismissible
      variant={alertSuccess ? "success" : "danger"}
      onClose={() => setShowAlert(false)}
    >
      {alertMessage}
    </Alert>
  );

  return (
    <div className="group-detail">
      {showAlert && alert}
      <h1 className="title">{capitalizeFirstLetter(group.groups_name)}</h1>
      <p>Số lượng thành viên: {members.length}</p>
      <MemberList
        members={members}
        groupId={group.groups_id}
        changeMemberRole={(userId, newRoleName) =>
          changeMemberRole(userId, newRoleName)
        }
        roles={roles}
        kickMember={(memberId) => kickMember(memberId)}
      />
      <div className="btns">
        <Button onClick={viewPresentClick}>View Presentation</Button>
        {canDeleteGroup() && (
          <DeleteButton
            text={
              <>
                Confirm remove group <strong>{group.groups_name}</strong>?
              </>
            }
            onDelete={() => removeGroup()}
          />
        )}
      </div>
    </div>
  );
}

export default GroupDetail;
