import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BsEyeFill,
  BsPatchQuestionFill,
  BsPencilSquare,
  BsPeopleFill
} from "react-icons/bs";
import {
  getAllMyPresentations,
  addNewPresentation,
  updatePresentation,
  deletePresentation
} from "../../fetch/presentationFetch";
import "./Presentation.css";
import EditPresentationModal from "./EditPresentationModal";
import AssignCollaboratorsModal from "./collab/AssignCollaboratorsModal";
import { updatePresentationCollaborators } from "../../fetch/collab";
import { getAllUsers } from "../../fetch/userFetch";
import QuestionModal from "../question/QuestionModal";
import DeleteButton from "../general/DeleteButton";

export default function MyPresentation() {
  const [listOfPresent, setListOfPresent] = useState([]);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Edit Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  // Assign colaborators states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState({});
  const [allUsers, setAllUsers] = useState([]);

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

  const handleClose = () => setShowDialog(false);
  const handleShow = () => setShowDialog(true);

  const onHandleSubmit = async (data) => {
    await addNewPresentation(null, params.userId, data.presentName);

    await getAllMyPresentations(params.userId)
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
    navigate(`/slides/mypresent/show/${id}`);
  };

  const deleteClick = async (id) => {
    await deletePresentation(id);
    setListOfPresent((prevList) =>
      prevList.filter((present) => present.presents_id !== id)
    );
  };

  useEffect(() => {
    getAllMyPresentations(params.userId)
      .then((data) => {
        setListOfPresent(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getAllUsers().then((data) => {
      setAllUsers(data);
    });
  }, []);

  function editPresentation(show, presentation) {
    setShowEditModal(show);
    setEditTarget(presentation);
  }

  function assignCollaborators(show, presentation) {
    setShowAssignModal(show);
    setAssignTarget(presentation);
  }

  function showQuestionsOfPresent(show, presentation) {
    setShowQuestionModal(show);
    setQuestionTarget(presentation);
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

  async function submitCollaborators(hasChange, presentId, newColaborators) {
    setShowAssignModal(false);
    setAssignTarget({});

    if (hasChange) {
      setListOfPresent((prevList) => {
        return prevList.map((item) => {
          if (item.presents_id === presentId) {
            return {
              ...item,
              collaborators: newColaborators
            };
          }
          return item;
        });
      });

      await updatePresentationCollaborators(presentId, newColaborators);
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
      <h1>My Presentations</h1>
      {listOfPresent.length !== 0 && (
        <div>
          {listOfPresent.map((present) => (
            <div
              key={present.presents_id}
              className="boxPresentation"
              style={{ marginTop: "10px" }}
            >
              <div className="boxPresentation2">
                <p className="title">{present.presents_name}</p>
                <div className="secondary-title">
                  {present["user.users_name"]}
                </div>
              </div>
              <div className="boxPresentation2" style={{ float: "right" }}>
                <Button
                  onClick={() => viewSlideClick(present.presents_id)}
                  variant="success"
                >
                  <BsEyeFill />
                </Button>
                <Button
                  onClick={() => editPresentation(true, present)}
                  variant="outline-warning"
                  style={{ marginLeft: "5px" }}
                >
                  <BsPencilSquare />
                </Button>
                <Button
                  onClick={() => assignCollaborators(true, present)}
                  variant="outline-info"
                  style={{ marginLeft: "5px" }}
                >
                  <BsPeopleFill />
                </Button>
                <Button
                  onClick={() => showQuestionsOfPresent(true, present)}
                  variant="outline-dark"
                  style={{ marginLeft: "5px" }}
                >
                  <BsPatchQuestionFill />
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
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <Button onClick={handleShow} style={{ marginLeft: "1rem" }}>
          Create presentation
        </Button>
      </div>

      {/* Edit presentation Modals */}
      <EditPresentationModal
        show={showEditModal}
        onHide={() => editPresentation(false, {})}
        target={editTarget}
        onSubmit={(hasChange, editedPresentation) =>
          submitEditedPresentation(hasChange, editedPresentation)
        }
      />

      {/* Assign Colaborators modal */}
      <AssignCollaboratorsModal
        show={showAssignModal}
        onHide={() => assignCollaborators(false, {})}
        target={assignTarget}
        onSubmit={(hasChange, presentId, newColaborators) =>
          submitCollaborators(hasChange, presentId, newColaborators)
        }
        allUsers={allUsers}
      />

      {/* Questions list modal */}
      <QuestionModal
        show={showQuestionModal}
        handleClose={() => showQuestionsOfPresent(false, {})}
        target={questionTarget}
      />

      {/* CREATE NEW PRESENTATION MODAL */}
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
