import React, { useState } from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import { Modal } from 'react-bootstrap';
import { getSubmitContent } from '../../fetch/slideFetch';
import { getFormattedDateTimeString } from '../../util/ultilis';
import { SocketContext } from '../socket/Socket'
import "./MemberChoiceModal.css";

export default function MemberChoiceModal({ slideId, show, handleCloseHistory, countHistory }) {
    const socket = useContext(SocketContext);

    const [listChoice, setListChoice] = useState([]);

    useEffect(() => {
        getSubmitContent(slideId).then((data) => {
            setListChoice(data.reverse());
        });
    }, [slideId, countHistory]);

    useEffect(() => {
        socket.on("submitSlide", (data) => {
            const slide = data.find((element) => element?.slides_id === slideId);
            getSubmitContent(slide?.slides_id).then((data) => {
                setListChoice(data.reverse());
            });
        })
    }, [socket])

    return (
        <>
            <Modal show={show} onHide={handleCloseHistory}>
                <Modal.Header closeButton>Submit-Content</Modal.Header>
                <Modal.Body>
                    {listChoice.length === 0 && "There is no submitted"}
                    {listChoice.map((item) => (
                        <div className="history">
                            <div className="history-content">
                                <div>
                                    <h1>{item?.users_name === undefined ? "Others" : item.users_name}</h1>
                                    <p>{getFormattedDateTimeString(item.time_submit)}</p>
                                </div>
                                <h1>{item.choice}</h1>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    )
}
