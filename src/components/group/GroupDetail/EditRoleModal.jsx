import React, {useEffect} from "react";
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
      <Modal.Body>
        <h3>{member.username}</h3>
        <p>{member.userId}</p>
        <p>{member.email}</p>
        <Form.Select value={roleName} onChange={handleChange}>
          {roles.map((role) => {
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
