import React from "react";
import { Button, Modal } from "react-bootstrap";

function AssignCollaboratorsModal({ show, onSubmit, target, onHide }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Assign Colaborators</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Assign colaborators to presentation</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignCollaboratorsModal;
