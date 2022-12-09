import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {getAllPresentationsInGroup, getUserRoleInGroup, addNewPresentation} from "../../fetch/presentationFetch";
import { useForm } from "react-hook-form";

import "./Presentation.css";

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
        await addNewPresentation(params.groupId, currentUserId, data.presentName)
        
        await getAllPresentationsInGroup(params.groupId)
        .then((data) =>{
            setListOfPresent(data)
            setAlertSuccess(true);
        })
        .catch((err) => {
            console.log(err)
            setAlertSuccess(false);
        })

        setShowDialog(false);
        setShowAlert(true);
    };

    const ViewSlide_Click = (e) => {
        console.log(e.target.id);
    }

    const Delete_Click = (e) => {
        console.log(e.target.id);
    }

    useEffect(() => {
        const currentUserId = getUserId();
        getUserRoleInGroup(params.groupId, currentUserId)
        .then((data) => {
            setUserInGroup(data)
        })
        .catch((err) => {
            console.log(err)
        })

        getAllPresentationsInGroup(params.groupId)
        .then((data) =>{
            setListOfPresent(data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, []);

    const BackToGroup_click = () => {
        navigate(`/group`)
    }

    const alert = (
        <Alert
          dismissible
          variant={alertSuccess ? "success" : "danger"}
          onClose={() => setShowAlert(false)}
        >
          {alertSuccess ? "Create presentation successfully" : "Failed to create presentation"}
        </Alert>
    );

    return (
        <div className="boxPresentation1">
            {showAlert && alert}
            {listOfPresent.map((present, index) => (
                <div key={present.presents_id} className="boxPresentation" style={{marginTop: "10px"}}>
                    <div className="boxPresentation2">
                        <div>
                            presentation name: {present.presents_name}
                        </div>
                        <div>
                            Creator: {present["user.users_name"]}
                        </div>
                    </div>
                    <div className="boxPresentation2" style={{float: "right"}}>
                        <Button id={present.presents_id} onClick={e => ViewSlide_Click(e)} variant="success">View slide</Button>
                        <Button id={present.presents_id} onClick={e => Delete_Click(e)} variant="danger" style={{marginLeft: "5px"}}>Delete presentation</Button>
                    </div>
                </div>
            ))}
            <div style={{marginTop: "5px"}}>
                <Button onClick={BackToGroup_click}>Back to my group</Button>
                {userInGroup.roles_id !== 3 &&
                    <Button  onClick={handleShow} style={{marginLeft: "5px"}}>Create presentation</Button>
                }
            </div>
            <div>         
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
        </div>
    )
}