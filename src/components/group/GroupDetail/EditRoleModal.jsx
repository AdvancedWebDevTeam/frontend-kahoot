import React, { useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function EditRoleModal({
  groupId,
  member,
  close,
  changeRole,
  roles,
  ...props
}) {
  const [roleName, setRoleName] = React.useState();
  const [availableRoles, setAvailableRoles] = React.useState([]);

  useEffect(() => {
    setAvailableRoles(roles.filter((role) => role.roles_id !== 1));
  }, []);

  useEffect(() => {
    setRoleName(member.roleName);
  }, [member]);

  function saveRoleChange() {
    changeRole(member.userId, roleName);
  }

  function handleChange(event) {
    setRoleName(event.target.value);
  }

  return (
    <Modal {...props} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Change member's role</Modal.Title>
      </Modal.Header>
      <Modal.Body className="edit-role-body">
        <h3>{member.username}</h3>
        <p className="edit-role-subtitle">{member.userId}</p>
        <p>Email: {member.email}</p>

        <p style={{ marginTop: ".5rem" }}>Role:</p>
        <Form.Select value={roleName} onChange={handleChange}>
          {availableRoles.map((role) => {
            const isSelected = role.roles_name === roleName;
            return (
              <option
                key={role.roles_id}
                value={role.roles_name}
                selected={isSelected}
              >
                {role.roles_name}
              </option>
            );
          })}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={saveRoleChange}>
          Save Role Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditRoleModal;
