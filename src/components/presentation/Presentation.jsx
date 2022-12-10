import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BsEyeFill,
  BsFillCaretLeftFill,
  BsFillTrashFill,
  BsPencilSquare
} from "react-icons/bs";
import {
  getAllPresentationsInGroup,
  getUserRoleInGroup,
  addNewPresentation
} from "../../fetch/presentationFetch";
import "./Presentation.css";
import EditPresentationModal from "./EditPresentationModal";

function getUserId() {
  const accessToken = localStorage.getItem("accessToken");
  return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

export default function Presentation() {
  const [userInGroup, setUserInGroup] = useState({
    users_id: "",
    groups_id: "",
    roles_id: 3
  });
  const [listOfPresent, setListOfPresent] = useState([]);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => setShowDialog(false);
  const handleShow = () => setShowDialog(true);

  const onHandleSubmit = async (data) => {
    const currentUserId = getUserId();
    await addNewPresentation(params.groupId, currentUserId, data.presentName);

    await getAllPresentationsInGroup(params.groupId)
      .then((returnData) => {
        setListOfPresent(returnData);
        setAlertSuccess(true);
      })
      .catch(() => {
        setAlertSuccess(false);
      });

    setShowDialog(false);
    setShowAlert(true);
  };

  const viewSlideClick = (e) => {
    navigate(`/slides/${params.groupId}/show/${e.target.id}`);
  };

  const deleteClick = (e) => {
    console.log(e.target.id);
  };

  useEffect(() => {
    const currentUserId = getUserId();
    getUserRoleInGroup(params.groupId, currentUserId)
      .then((data) => {
        setUserInGroup(data);
      })
      .catch((err) => {
        console.log(err);
      });

    getAllPresentationsInGroup(params.groupId)
      .then((data) => {
        setListOfPresent(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const backToGroupClick = () => {
    navigate(`/group`);
  };

  function editPresentation(presentation) {
    setShowEditModal(true);
    setEditTarget(presentation);
  }

  function submitEditedPresentation(hasChange, editedPresentation) {
    setShowEditModal(false);
    setEditTarget({});

    if (hasChange) {
      const editedId = editedPresentation.presentation_id;
      const newListOfPresent = listOfPresent.map((item) => {
        if (item.presentations_id === editedId) {
          return editedPresentation;
        }
        return item;
      });
      setListOfPresent(newListOfPresent);

      // TODO: submit change to backend
    }
  }

  const alert = (
    <Alert
      dismissible
      variant={alertSuccess ? "success" : "danger"}
      onClose={() => setShowAlert(false)}
    >
      {alertSuccess
        ? "Create presentation successfully"
        : "Failed to create presentation"}
    </Alert>
  );

  return (
    <div className="boxPresentation1">
      {showAlert && alert}
      <h1>Presentations</h1>
      {listOfPresent.map((present) => (
        <div
          key={present.presents_id}
          className="boxPresentation"
          style={{ marginTop: "10px" }}
        >
          <div className="boxPresentation2">
            <p className="title">{present.presents_name}</p>
            <div className="secondary-title">{present["user.users_name"]}</div>
          </div>
          <div className="boxPresentation2" style={{ float: "right" }}>
            <Button
              onClick={(e) => viewSlideClick(e)}
              variant="success"
              id={present.presents_id}
            >
              <BsEyeFill />
            </Button>
            <Button
              onClick={() => editPresentation(present)}
              variant="outline-warning"
              style={{ marginLeft: "5px" }}
            >
              <BsPencilSquare />
            </Button>
            <Button
              id={present.presents_id}
              onClick={(e) => deleteClick(e)}
              variant="outline-danger"
              style={{ marginLeft: "5px" }}
            >
              <BsFillTrashFill />
            </Button>
          </div>
        </div>
      ))}
      <div>
        <Button
          onClick={backToGroupClick}
          variant="outline-secondary"
          style={{ textAlign: "center" }}
        >
          <BsFillCaretLeftFill />
        </Button>
        {userInGroup.roles_id !== 3 && (
          <Button onClick={handleShow} style={{ marginLeft: "1rem" }}>
            Create presentation
          </Button>
        )}
      </div>

      <EditPresentationModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        target={editTarget}
        onSubmit={submitEditedPresentation}
      />

      {/* CREATE NEW PRESENTATION MODEL */}
      <Modal show={showDialog} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new presentation</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
          <Modal.Body>
            <Form.Group className="md-3">
              <Form.Control
                id="presentName"
                type="text"
                placeholder="Enter name"
                {...register("presentName", { required: true })}
              />
            </Form.Group>
            {errors.presentName?.type === "required" && (
              <Form.Text className="text-danger" role="alert">
                Presentation's name is required
              </Form.Text>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
