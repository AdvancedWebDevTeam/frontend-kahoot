import React, { useContext, useCallback } from 'react'
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SocketContext } from '../socket/Socket';
import { Form } from 'react-bootstrap';
import "./MemberView.css";
import { submitSlide } from '../../fetch/slideFetch';

export default function MemberView() {

    const [slide, setSlide] = useState([]);
    const [presentId, setPresentID] = useState("");
    const [options, setOptions] = useState([]);
    const [result, setResult] = useState("");
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on('clickedSlide', (data) => {
            setSlide(data.listOfSlide[data.indexSlide]);
            setOptions(Object.getOwnPropertyNames(data.listOfSlide[data.indexSlide].options));
            setPresentID(data.listOfSlide[data.indexSlide].presents_id);
        });
        return () => {
            socket.off('clickedSlide', (data) => {
                setSlide(data.listOfSlide[data.indexSlide]);
                setOptions(Object.getOwnPropertyNames(data.listOfSlide[data.indexSlide].options));
                setPresentID(data.listOfSlide[data.indexSlide].presents_id);
            });
        }
    }, [socket])

    const onSubmit = (e) => {
        if (result != "") {
            submitSlide(presentId, slide.slides_id, slide.question, result);
        }
    };

    return (
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
                            id={item}
                        />
                    </div>
                ))}
                <Button variant="primary" type="submit" className='btnSubmit'>
                    Submit
                </Button>
            </Form>
        </div>
    )
}
