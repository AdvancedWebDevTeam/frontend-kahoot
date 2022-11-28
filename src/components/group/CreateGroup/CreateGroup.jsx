import React, { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { getPotentialMembersForOwner } from "../../../usecase/group";
import { postCreateGroupRequest } from "../../../fetch/groupFetch";
import "./createGroup.css";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

function CreateGroup({ addNewGroup }) {
  const currentUserId = getUserId();
  const [groupName, setGroupName] = React.useState("");
  const [members, setMembers] = React.useState([]);
  const [membersToChoose, setMembersToChoose] = React.useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);
  const [failedToCreateGroup, setFailedToCreateGroup] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false);

  useEffect(() => {
    getPotentialMembersForOwner(currentUserId).then((data) => {
      setMembersToChoose(data);
    });
  }, []);

  function resetForm() {
    setGroupName("");
  }

  function submitGroup(e) {
    e.preventDefault();
    setIsCreatingGroup(true);
    postCreateGroupRequest(groupName, currentUserId, members)
      .then((result) => {
        setIsCreatingGroup(false);
        setFailedToCreateGroup(!result.status);
        setShowAlert(true);
        resetForm();
        addNewGroup(result.data);
      })
      .catch(() => {
        setIsCreatingGroup(false);
        setFailedToCreateGroup(true);
        setShowAlert(true);
      });
  }

  const alert = (
    <Alert
      dismissible
      variant={failedToCreateGroup ? "danger" : "success"}
      onClose={() => setShowAlert(false)}
    >
      {failedToCreateGroup ? "Failed to create group" : "Group created!"}
    </Alert>
  );

  return (
    <div className="create-group">
      <h1>Create new group</h1>
      {showAlert && alert}
      <Form>
        <Form.Group className="mb-3" controlId="createGroup.nameInput">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="createGroup.membersInput">
          <Form.Label>Add members to your group</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={members}
            onChange={(e) =>
              setMembers(
                [].slice
                  .call(e.target.selectedOptions)
                  .map((item) => item.value)
              )
            }
          >
            {membersToChoose.map((member) => (
              <option key={member.users_id} value={member.users_id}>
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
          onClick={!isCreatingGroup ? submitGroup : null}
        >
          {isCreatingGroup ? "Creating..." : "Create Group"}
        </Button>
      </Form>
    </div>
  );
}

export default CreateGroup;
