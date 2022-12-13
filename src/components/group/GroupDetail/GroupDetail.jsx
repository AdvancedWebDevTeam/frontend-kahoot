import React, { useEffect } from "react";
import MemberList from "./MemberList";
import { getMembersInGroup } from "../../../fetch/groupFetch";
import { capitalizeFirstLetter } from "../../../util/string";
import "./groupDetail.css";
import { requestMemberRoleChange } from "../../../fetch/roleFetch";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function GroupDetail({ group, roles }) {
  const [members, setMembers] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSuccess, setAlertSuccess] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMembersInGroup(group.groups_id).then((data) => {
      setMembers(data);
    });
  }, []);

  const viewPresent_Click = () => {
    navigate(`/presentations/${group.groups_id}`);
  }

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
        }
      })
      .catch(() => {
        setShowAlert(true);
        setAlertSuccess(false);
      });
  }

  const alert = (
    <Alert
      dismissible
      variant={alertSuccess ? "success" : "danger"}
      onClose={() => setShowAlert(false)}
    >
      {alertSuccess ? "Change role successfully" : "Failed to change role"}
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
      />
      <div>
        <Button onClick={viewPresent_Click}>View Presentation</Button>
      </div>
    </div>
  );
}

export default GroupDetail;
