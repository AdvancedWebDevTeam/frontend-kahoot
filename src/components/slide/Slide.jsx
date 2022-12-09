import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getAllSlides, getNameAndCreator } from "../../fetch/slideFetch"
import EditSlide from "./EditSlide";
import MainView from "./MainView";
import "./Slide.css";

export default function Slide()
{

    const [listOfSlides, setListOfSlides] = useState([]);
    const [presentInfo, setPresentInfo] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState();


    
    //const [mainView, setMainView] = useState()

    
    const handleClick = (index) => {
        setSelectedIndex(index);
    }

    const handleChange = (e) => {
        setTypeName(e.target.value);
    }

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        
        getNameAndCreator(params.presentId)
        .then((data) => {
            setPresentInfo(data);
        })
        .catch((err) => {
            console.log(err)
        })

        getAllSlides(params.presentId)
        .then((data) => {
            setListOfSlides(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    //setMainView(data[0]);
    //setTypeName(data[0]["type.types_name"]);

    const BackToPresent_Click = () => {
        navigate(`/presentations/${params.groupId}`);
    }
    return(
        <div>
            <div className="boxSlide1">
                <h4 style={{marginLeft: "8px"}}>{presentInfo.presents_name}</h4>
                <span style={{marginLeft: "8px"}}>Created by {presentInfo["user.users_name"]}</span>
            </div>
            <div className="boxSlide1">
                <Button style={{marginLeft: "5px"}}>Create slide</Button>
                <Button style={{marginLeft: "5px"}} onClick={BackToPresent_Click}>Back to presentation</Button>
            </div>
            <div>
                <Row>
                    <Col xs={2}>
                        <div className="boxSlide5">
                            {listOfSlides.map((slide, i) =>
                                <div key={slide.slides_id} className={listOfSlides[selectedIndex].slides_id === slide.slides_id ? "clicked" : "boxSlide4"} style={{float: "left"}} onClick={()=>handleClick(i)}>
                                    <div style={{display: "inline-block"}}>
                                        <h5>{i + 1}</h5>
                                    </div>
                                    <div className="boxSlide2" style={{display: "inline-block", marginLeft: "3px"}}>
                                        <h5>{slide.slides_id}</h5>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xs={6}>
                        <MainView 
                        selectedIndex={selectedIndex} 
                        listOfSlides={listOfSlides}
                        />
                    </Col>
                    <Col xs={4}>
                        <EditSlide
                        selectedIndex={selectedIndex}
                        listOfSlides={listOfSlides}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}