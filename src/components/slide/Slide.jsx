import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./Slide.css";

export default function Slide()
{
    const imgs = [
        {id:0,value:"https://wallpaperaccess.com/full/2637581.jpg"},
        {id:1,value:"https://source.unsplash.com/user/c_v_r/1900x800"},
        {id:2,value:"https://source.unsplash.com/user/c_v_r/100x100"},
    ]

    const [listOfslides, setListofSlides] = useState([]);

    const [mainView, setMainView] = useState(imgs[0])
    
    const handleClick = (index) => {
        console.log(index)
        const selectedItem = imgs[index];
        setMainView(selectedItem)
    }

    const navigate = useNavigate();
    const params = useParams();

    const BackToPresent_Click = () => {
        navigate(`/presentations/${params.groupId}`);
    }

    return(
        <div>
            <div className="boxSlide1">
                <h4 style={{marginLeft: "8px"}}>Slide Name</h4>
                <span style={{marginLeft: "8px"}}>Created by</span>
            </div>
            <div className="boxSlide1">
                <Button style={{marginLeft: "5px"}}>Create slide</Button>
                <Button style={{marginLeft: "5px"}} onClick={BackToPresent_Click}>Back to presentation</Button>
            </div>
            <div>
                <Row>
                    <Col xs={2}>
                        <div className='flex_row'>
                            {imgs.map((data, i) =>
                                <div key={i} className={mainView.id === i ? "clicked" : "boxSlide4"} style={{float: "left"}} onClick={()=>handleClick(i)}>
                                    <div style={{display: "inline-block"}}>
                                        <h5>{i + 1}</h5>
                                    </div>
                                    <div className="boxSlide2" style={{display: "inline-block", marginLeft: "3px"}}>
                                        <img src={data.value} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="boxSlide" style={{marginTop: "5px"}}>
                            <img src={mainView.value}/> 
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="boxSlide3">
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}