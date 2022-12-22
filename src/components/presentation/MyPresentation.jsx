import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    BsEyeFill,
    BsFillTrashFill,
    BsPencilSquare
} from "react-icons/bs";
import {
    getAllMyPresentations,
    addNewPresentation,
    updatePresentation,
    deletePresentation
} from "../../fetch/presentationFetch";
import "./Presentation.css";
import EditPresentationModal from "./EditPresentationModal";

export default function MyPresentation() {

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
        await addNewPresentation("", params.userId, data.presentName);

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

    const deleteClick = (id) => {
        deletePresentation(id);
        window.location.reload();
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
            {listOfPresent.length !== 0 &&
                <div>
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
                                <Button
                                    onClick={(e) => deleteClick(present.presents_id)}
                                    variant="outline-danger"
                                    style={{ marginLeft: "5px" }}
                                >
                                    <BsFillTrashFill />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            }
            <div>
                <Button onClick={handleShow} style={{ marginLeft: "1rem" }}>
                    Create presentation
                </Button>
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