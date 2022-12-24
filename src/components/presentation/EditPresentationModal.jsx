import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
function EditPresentationModal({ target, show, onHide, onSubmit }) {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    setName(target.presents_name);
  }, [target]);

  async function handleFormSubmit() {
    const trimmedName = name.trim();
    if (trimmedName !== target.presents_name) {
      onSubmit(true, { ...target, presents_name: trimmedName });
    } else {
      onSubmit(false, target);
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Edit Presentation</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Presentation's name:</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Enter new name for presentation"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save change
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Assign collaborators
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditPresentationModal;
