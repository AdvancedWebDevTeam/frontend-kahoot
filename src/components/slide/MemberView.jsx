import React, { useContext, useCallback } from 'react'
import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { SocketContext } from '../socket/Socket';
import { Form } from 'react-bootstrap';
import "./MemberView.css";
import { getSlidePresent, submitSlide } from '../../fetch/slideFetch';
import { useParams } from 'react-router-dom';

export default function MemberView() {

    const [slide, setSlide] = useState([]);
    const [presentId, setPresentID] = useState("");
    const [options, setOptions] = useState([]);
    const [result, setResult] = useState("");
    const socket = useContext(SocketContext);
    const [showAlert, setShowAlert] = useState(false);

    const param = useParams();

    useEffect(() => {
        socket.on("clickedSlide", (data) => {
            setSlide(data.listOfSlide[data.indexSlide]);
            setOptions(Object.getOwnPropertyNames(data.listOfSlide[data.indexSlide].options));
            setPresentID(data.listOfSlide[data.indexSlide].presents_id);
        });
        return () => {
            socket.off("clickedSlide");
        }
    }, [socket])

    useEffect(() => {
        getSlidePresent(param.presentId).then((data) => {
            setSlide(data.listOfSlides[data.indexSlide.index_slide]);
            setOptions(Object.getOwnPropertyNames(data.listOfSlides[data.indexSlide.index_slide].options));
            setPresentID(data.indexSlide.presents_id);
        }).catch(err => console.log(err));
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        if (result !== "") {
            submitSlide(presentId, slide.slides_id, slide.question, result);
            setResult("");
            setShowAlert(true);
        }
    };

    const alert = (
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
        >
          Your choice is submitted!
        </Alert>
      );

    return (
        <>
        {showAlert && alert}
        <div className='containerMemberView'>
            <h1>Multiple Choice</h1>
            <Form onSubmit={(e) => onSubmit(e)}>
                {options.map((item) => (
                    <div className={result === item ? "mb-3 containercbxFocus" : "mb-3 containercbx"} key={`inline-${item}`}>
                        <Form.Check
                            onChange={(e) => setResult(e.target.id)}
                            label={item}
                            name="group1"
                            type='radio'
                            checked={result === item}
                            id={item}
                        />
                    </div>
                ))}
                <Button variant="primary" type="submit" className='btnSubmit'>
                    Submit
                </Button>
            </Form>
        </div>
        </>
    )
}
