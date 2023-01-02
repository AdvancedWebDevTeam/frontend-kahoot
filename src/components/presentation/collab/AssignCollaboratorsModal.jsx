import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import CollaboratorCard from "./CollaboratorCard";
import NewCollaboratorForm from "./NewCollaboratorForm";
import { getLoggedInUserId } from "../../../util/ultilis";

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
function AssignCollaboratorsModal({ show, onSubmit, target, onHide }) {
  const [collaborators, setCollaborators] = React.useState([]);

  useEffect(() => {
    setCollaborators(target.collaborators ?? []);
  }, [target]);

  function submitCollaborators() {
    if (!areEqualCollaboratorsArray(collaborators, target.collaborators)) {
      onSubmit(true, target.presents_id, collaborators);
    } else {
      onSubmit(false, null, null);
    }
  }

  async function removeCollaborator(userId) {
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.userId !== userId)
    );
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
          <NewCollaboratorForm />
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
