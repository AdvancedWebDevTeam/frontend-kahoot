import React, { useState } from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import { Modal } from 'react-bootstrap';
import { getSubmitContent } from '../../fetch/slideFetch';
import { getFormattedDateTimeString } from '../../util/ultilis';
import { SocketContext } from '../socket/Socket'

export default function MemberChoiceModal({slideId ,show, handleCloseHistory}) {
    const socket = useContext(SocketContext);

    const [listChoice, setListChoice] = useState([]);

    useEffect(() => {
        getSubmitContent(slideId).then((data) => {
            setListChoice(data);
        });
    }, [slideId]);

    useEffect(() => {
        socket.on("submitSlide", (data) => {
            const slide = data.find((element) => element.slides_id === slideId);
            getSubmitContent(slide.slides_id).then((data) => {
                setListChoice(data);
            });
        })
    }, [socket])
    
    return (
    <>
        <Modal show={show} onHide={handleCloseHistory}>
            <Modal.Header closeButton>Test</Modal.Header>
            <Modal.Body>
                {listChoice.length === 0 && "There is no submitted"}
                {listChoice.map((item) => (
                    <div>
                            <p>{item.users_id}</p>
                            <p>{item.choice}</p>
                            <p>{getFormattedDateTimeString(item.time_submit)}</p>
                    </div>
                ))}
            </Modal.Body>
        </Modal>
    </>
  )
}
