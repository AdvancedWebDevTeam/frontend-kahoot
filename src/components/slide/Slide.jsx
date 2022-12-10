import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { getAllSlides, getNameAndCreator, getSlideTypes } from "../../fetch/slideFetch"
import EditSlide from "./EditSlide";
import MainView from "./MainView";
import "./Slide.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Slide() {
    const [listOfSlides, setListOfSlides] = useState([]);
    const [presentInfo, setPresentInfo] = useState([]);
    const [listOfSlideTypes, setListofSlideTypes] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = (index) => {
        setSelectedIndex(index);
    }

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {

        getSlideTypes()
            .then((data) => {
                setListofSlideTypes(data);
            })
            .catch((err) => {
                console.log(err);
            })

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

    const BackToPresent_Click = () => {
        navigate(`/presentations/${params.groupId}`);
    }
    return (
        <div>
            <div className="boxSlide1">
                <h4 style={{ marginLeft: "8px" }}>{presentInfo.presents_name}</h4>
                <span style={{ marginLeft: "8px" }}>Created by {presentInfo["user.users_name"]}</span>
            </div>
            <div className="boxSlide1">
                <Button style={{ marginLeft: "5px" }}>Create slide</Button>
                <Button style={{ marginLeft: "5px" }} onClick={BackToPresent_Click}>Back to presentation</Button>
            </div>
            <div>
                <Row>
                    <Col xs={2}>
                        <div className="boxSlide5">
                            {listOfSlides.map((slide, i) =>
                                <div key={slide.slides_id} className={listOfSlides[selectedIndex].slides_id === slide.slides_id ? "clicked" : "boxSlide4"} style={{ float: "left" }} onClick={() => handleClick(i)}>
                                    <div style={{ display: "inline-block", float: "inline-start" }}>
                                        <span>{i + 1}</span>
                                    </div>
                                    <div className="boxSlide2" style={{ display: "inline-block", marginLeft: "3px" }}>
                                        {slide.types_id === 0 &&
                                            <div></div>
                                        }
                                        {slide.types_id === 1 &&
                                            <Bar
                                                width={"5%"}
                                                data={{
                                                    labels: [
                                                        "Africa",
                                                        "Asia",
                                                        "Euruesd",
                                                        "adsad",
                                                    ],
                                                    datasets: [
                                                        {
                                                            label: "",
                                                            backgroundColor: [
                                                                "#3e95cd",
                                                                "#8e5ea2",
                                                            ],
                                                            data: [0, 12, 2, 1]
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    legend: { display: false },
                                                    maintainAspectRatio: false
                                                }}
                                            />
                                        }
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
                            listOfSlideTypes={listOfSlideTypes}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}