import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BsEyeFill,
  BsFillCaretLeftFill,
  BsFillTrashFill,
  BsPatchQuestionFill,
  BsPencilSquare
} from "react-icons/bs";
import {
  getAllPresentationsInGroup,
  getUserRoleInGroup,
  addNewPresentation,
  updatePresentation,
  deletePresentation
} from "../../fetch/presentationFetch";
import "./Presentation.css";
import EditPresentationModal from "./EditPresentationModal";
import { getLoggedInUserId } from "../../util/ultilis";
import QuestionModal from "../question/QuestionModal";
import { getOwnerAndCoOwnersOfGroup } from "../../fetch/groupFetch";
import DeleteButton from "../general/DeleteButton";

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
  const [authorities, setAuthorities] = useState([]);

  // Question Modal states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionTarget, setQuestionTarget] = useState({});

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
    const currentUserId = getLoggedInUserId();
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

  const viewSlideClick = (id) => {
    navigate(`/slides/${params.groupId}/show/${id}`);
  };

  const deleteClick = async (id) => {
    await deletePresentation(id);
    setListOfPresent((prevList) =>
      prevList.filter((present) => present.presents_id !== id));
  };

  useEffect(() => {
    const currentUserId = getLoggedInUserId();
    getUserRoleInGroup(params.groupId, currentUserId).then((data) => {
      setUserInGroup(data);
    });

    getAllPresentationsInGroup(params.groupId).then((data) => {
      setListOfPresent(data);
    });

    getOwnerAndCoOwnersOfGroup(params.groupId).then((data) => {
      setAuthorities(data);
    });
  }, []);

  const backToGroupClick = () => {
    navigate(`/group`);
  };

  function editPresentation(presentation) {
    setShowEditModal(true);
    setEditTarget(presentation);
  }

  async function submitEditedPresentation(hasChange, editedPresentation) {
    setShowEditModal(false);
    setEditTarget({});

    if (hasChange) {
      const editedId = editedPresentation.presents_id;
      const newListOfPresent = listOfPresent.map((item) => {
        if (item.presents_id === editedId) {
          return editedPresentation;
        }
        return item;
      });
      setListOfPresent(newListOfPresent);

      await updatePresentation(editedId, editedPresentation.presents_name);
    }
  }

  function showQuestionsOfPresent(show, presentation) {
    setShowQuestionModal(show);
    setQuestionTarget({
      ...presentation,
      collaborators: authorities
    });
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
      <h1>Group Presentations</h1>
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
            <div>
              {userInGroup.roles_id !== 3 && (
                <>
                  <Button
                    onClick={() => viewSlideClick(present.presents_id)}
                    variant="success"
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
                  <DeleteButton
                    text={
                      <>
                        Remove presentation{" "}
                        <strong>{present.presents_name}</strong>?
                      </>
                    }
                    onDelete={() => deleteClick(present.presents_id)}
                    style={{ marginLeft: "5px" }}
                  />
                </>
              )}
              <Button
                onClick={() => showQuestionsOfPresent(true, present)}
                variant="outline-dark"
                style={{ marginLeft: "5px" }}
              >
                <BsPatchQuestionFill />
              </Button>
            </div>
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

      {/* Edit presentation Modals */}
      <EditPresentationModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        target={editTarget}
        onSubmit={submitEditedPresentation}
      />

      {/* Questions list modal */}
      <QuestionModal
        show={showQuestionModal}
        handleClose={() => showQuestionsOfPresent(false, {})}
        target={questionTarget}
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
