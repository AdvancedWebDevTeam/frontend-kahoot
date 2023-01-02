import React, { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import { getPotentialMembersForOwner } from "../../../usecase/group";
import "./joinGroup.css";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

export default function JoinGroup() {
  const currentUserId = getUserId();
  const [groupName, setGroupName] = React.useState("");
  const [members, setMembers] = React.useState([]);
  const [membersToChoose, setMembersToChoose] = React.useState([]);
  const [isSendingInvitation, setisSendingInvitation] = React.useState(false);
  const [failedToSendInvite, setfailedToSendInvite] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);

  useEffect(() => {
    getPotentialMembersForOwner(currentUserId).then((data) => {
      setMembersToChoose(data);
    });
  }, []);

  function resetForm() {
    setGroupName("");
  }

  const submitGroup = async (e) => {
    e.preventDefault();
    setisSendingInvitation(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/groups/${currentUserId}/invite`, {
        groupName,
        emails: members
      })
      .then((response) => {
        setisSendingInvitation(false);
        setfailedToSendInvite(!(response.data === "success"));
        setShowAlert(true);
        resetForm();
      })
      .catch(() => {
        setisSendingInvitation(false);
        setfailedToSendInvite(true);
        setShowAlert(true);
      });
  };

  const alert = (
    <Alert
      dismissible
      variant={failedToSendInvite ? "danger" : "success"}
      onClose={() => setShowAlert(false)}
    >
      {failedToSendInvite
        ? "Failed to send the invitation"
        : "Invitation had been sent!"}
    </Alert>
  );

  return (
    <div className="join-group">
      <h1>Invite User join to Group</h1>
      {showAlert && alert}
      <Form>
        <Form.Group className="mb-3" controlId="joinGroup.nameInput">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="joinGroup.membersInput">
          <Form.Label>Add members to your group</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={members}
            onChange={(e) => {
              setMembers(
                [].slice
                  .call(e.target.selectedOptions)
                  .map((item) => item.value)
              );
            }}
          >
            {membersToChoose.map((member) => (
              <option key={member.users_id} value={member.email}>
                {member.users_name} - {member.email}
              </option>
            ))}
          </Form.Control>
          <Form.Text>
            Hold down the Ctrl (windows) / Command (Mac) button to select
            multiple
          </Form.Text>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={!isSendingInvitation ? submitGroup : null}
        >
          {isSendingInvitation ? "Inviting..." : "Invite"}
        </Button>
      </Form>
    </div>
  );
}
