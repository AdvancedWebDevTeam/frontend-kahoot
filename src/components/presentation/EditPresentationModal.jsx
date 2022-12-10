import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

function EditPresentationModal({ target, show, onHide, onSubmit }) {
  const { register, handleSubmit } = useForm();

  function handleFormSubmit(data) {
    const { name } = data;
    if (name !== target.presents_name) {
      onSubmit(true, { ...target, presents_name: name });
    } else {
      onSubmit(false, target);
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Edit Presentation</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Presentation's name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              defaultValue={target.presents_name}
              placeholder="Enter new name for presentation"
              {...register("name", { required: true })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save change
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditPresentationModal;
