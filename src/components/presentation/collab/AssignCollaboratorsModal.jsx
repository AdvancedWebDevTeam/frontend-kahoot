import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CollaboratorCard from "./CollaboratorCard";
import NewCollaboratorForm from "./NewCollaboratorForm";
import { getLoggedInUserId } from "../../../util/ultilis";
import { getAllUsers } from "../../../fetch/userFetch";

function areEqualCollaboratorsArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].userId !== arr2[i].userId) {
      return false;
    }
  }

  return true;
}

// eslint-disable-next-line react/prop-types
function AssignCollaboratorsModal({
  show,
  onSubmit,
  target,
  onHide,
  allUsers
}) {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollabs, setNewCollabs] = useState([]);
  const [potentialCollabOptions, setPotentialCollabOptions] = useState([]);

  useEffect(() => {
    setPotentialCollabOptions(
      allUsers
        .map((user) => {
          return {
            value: user.email,
            label: user.email,
            id: user.users_id,
            name: user.users_name
          };
        })
        .filter(
          (user) =>
            user.id !== getLoggedInUserId() &&
            !collaborators.some((collab) => collab.userId === user.id) &&
            user.id !== target["user.users_id"]
        )
    );
  }, [collaborators, target]);

  useEffect(() => {
    setCollaborators(target.collaborators ?? []);
  }, [target.collaborators]);

  function submitCollaborators() {
    const collabList = [...collaborators, ...newCollabs];
    console.debug("submitCollaborators", collabList);
    if (!areEqualCollaboratorsArray(collabList, target.collaborators)) {
      onSubmit(true, target.presents_id, collabList);
      setNewCollabs([]);
      setCollaborators([]);
    } else {
      onSubmit(false, null, null);
    }
  }

  function removeCollaborator(userId) {
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.userId !== userId)
    );
  }

  function addCollaborators(collabs) {
    setNewCollabs(collabs);
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Assign Collaborators</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Assign collaborators to presentation</p>
        <div>
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.userId}
              collaborator={collaborator}
              allowDelete={target["user.users_id"] === getLoggedInUserId()}
              onRemoveCollaborator={removeCollaborator}
            />
          ))}
          <NewCollaboratorForm
            options={potentialCollabOptions}
            onAdd={addCollaborators}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitCollaborators}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignCollaboratorsModal;
