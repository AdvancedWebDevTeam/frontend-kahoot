import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function Slide()
{
    const navigate = useNavigate();
    const params = useParams();

    const BackToPresent_Click = () => {
        navigate(`/presentations/${params.groupId}`);
    }

    return(
        <div>
            <Button>Create slide</Button>
            <Button onClick={BackToPresent_Click}>Back to presentation</Button>
            <div>
                Hello group: {params.groupId} and Welcome: {params.presentId}
            </div>
        </div>
    )
}