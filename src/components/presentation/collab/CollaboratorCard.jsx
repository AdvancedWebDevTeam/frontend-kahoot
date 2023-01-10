import React from "react";
import { Button, Popover } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function CollaboratorCard({
  collaborator,
  onRemoveCollaborator,
  allowDelete
}) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  function removeCollaborator() {
    onRemoveCollaborator(collaborator.userId);
  }

  const popover = (
    <Popover>
      <Popover.Body>
        <p>
          Remove collaborator <strong>{collaborator.username}</strong>?
        </p>
        <Button
          className="fs-7 m-1"
          variant="danger"
          onClick={() => removeCollaborator()}
        >
          Yes
        </Button>
        <Button
          className="fs-7"
          variant="outline-secondary"
          onClick={() => setShowConfirm(false)}
        >
          No
        </Button>
      </Popover.Body>
    </Popover>
  );

  const overlay = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={popover}
      show={showConfirm}
    >
      <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
        <BsTrash />
      </Button>
    </OverlayTrigger>
  );

  return (
    <div className="card collab">
      <div className="card-body">
        <p>{collaborator.username}</p>
        <p>{collaborator.email}</p>
      </div>
      {allowDelete && overlay}
    </div>
  );
}
