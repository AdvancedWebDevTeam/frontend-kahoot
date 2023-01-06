import { useEffect, useState, useContext } from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import { socket, SocketContext } from "../socket/Socket";
import { useNavigate } from "react-router";

export function JoinRoomSocket({ user }) {
  const socket = useContext(SocketContext);
  const [data, setData] = useState("");
  const [isShow, SetISShow] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("Join", user.users_id);
    socket.on("NotifyPresentation", (data) => {
      setData(data);
      SetISShow(true);
    });

    return () => {
      socket.off("NotifyPresentation");
    };
  });

  const AttendClicked = () => {
    SetISShow(false);
    navigate(`/share/private/slide/${data.presents_id}`);
  }
  return (
    <div>
      {isShow && (
        <Modal show onHide={() => SetISShow(false)}>
          <Modal.Header>
            <Modal.Title>Notify</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="success">{`${data.presents_name} is presenting in group ${data.groups_name}`}</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={AttendClicked}>
              Attend
            </Button>
            <Button variant="outline-secondary" onClick={() => SetISShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
