import React, { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MemberList from "./MemberList";
import {
  getMembersInGroup,
  requestKickMember
} from "../../../fetch/groupFetch";
import { capitalizeFirstLetter } from "../../../util/ultilis";
import "./groupDetail.css";
import { requestMemberRoleChange } from "../../../fetch/roleFetch";

function GroupDetail({ group, roles }) {
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
        changeMemberRole={changeMemberRole}
        roles={roles}
        kickMember={kickMember}
      />
      <div>
        <Button onClick={viewPresentClick}>View Presentation</Button>
      </div>
    </div>
  );
}

export default GroupDetail;
