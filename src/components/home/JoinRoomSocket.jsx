import { useEffect, useState, useContext } from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import { socket, SocketContext } from "../socket/Socket";

export function JoinRoomSocket({ user }) {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.emit("Join", user.users_id);
    socket.on("NotifyPresentation", (data) => {
      setMessage(data);
    });

    return () => {
      socket.off("NotifyPresentation");
    };
  });

  return (
    <div>
      {message !== "" && (
        <Modal show onHide={() => setMessage("")}>
          <Modal.Header>
            <Modal.Title>Notify</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="success">{message}</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setMessage("")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
