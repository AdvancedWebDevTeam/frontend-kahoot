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

import { getAllSlides, getNameAndCreator, getSlideTypes, addSlide } from "../../fetch/slideFetch"
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
    const [isFetch, setIsFetch] = useState(false);

    const handleClick = (index) => {
        setSelectedIndex(index);
    }

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if(listOfSlideTypes.length === 0){
            getSlideTypes()
            .then((data) => {
                setListofSlideTypes(data);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        if(presentInfo.length === 0){
            getNameAndCreator(params.presentId)
            .then((data) => {
                setPresentInfo(data);
            })
            .catch((err) => {
                console.log(err)
            })
        }

        getAllSlides(params.presentId)
            .then((data) => {
                setListOfSlides(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [isFetch])

    const BackToPresent_Click = () => {
        navigate(`/presentations/${params.groupId}`);
    }

    const onChangeType = (typeId, typeName) => {
        const newList = [...listOfSlides]

        newList[selectedIndex].types_id = typeId;
        newList[selectedIndex]["type.types_name"] = typeName;

        setListOfSlides(newList);
    }

    const CreateSlide_Click = () => {
        addSlide(params.presentId, 0, "")
        .catch((err) => {
            console.log(err);
        });
        const flag = !isFetch;
        setIsFetch(flag)
    }

    const FetchListOfSlide = () => {
        const flag = !isFetch
        setIsFetch(flag);
    }

    return (
        <div>
            <div className="boxSlide1">
                <h4 style={{ marginLeft: "8px" }}>{presentInfo.presents_name}</h4>
                <span style={{ marginLeft: "8px" }}>Created by {presentInfo["user.users_name"]}</span>
            </div>
            <div className="boxSlide1">
                <Button style={{ marginLeft: "5px" }} onClick={CreateSlide_Click}>Create slide</Button>
                <Button style={{ marginLeft: "5px" }}>Delete slide</Button>
                <Button style={{ marginLeft: "5px", float: "right" }} onClick={BackToPresent_Click}>Back to presentation</Button>
                <Button style={{ marginLeft: "5px", float: "right" }}>Present slides</Button>
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
                                                width={"150px"}
                                                height={"100px"}
                                                data={{
                                                    labels: Object.keys(listOfSlides[i].options),
                                                    datasets: [
                                                        {
                                                            label: listOfSlides[i].question,
                                                            backgroundColor: [
                                                                "#3e95cd",
                                                                "#8e5ea2",
                                                            ],
                                                            data: Object.values(listOfSlides[i].options)
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    responsive: true,
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
                            onChangeType={onChangeType}
                            FetchListOfSlide={FetchListOfSlide}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}