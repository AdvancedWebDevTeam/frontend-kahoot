import { useState, useEffect, useContext } from "react";
import { Button, Container, Modal } from "react-bootstrap";
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
  Legend
} from "chart.js";

import {
  BsFillCaretLeftFill,
  BsFillPlayCircleFill,
  BsFillTrashFill
} from "react-icons/bs";
import {
  getAllSlides,
  getNameAndCreator,
  getSlideTypes,
  addSlide,
  deleteSlide
} from "../../fetch/slideFetch";
import EditSlide from "./EditSlide";
import MainView from "./MainView";
import "./Slide.css";
import TooltipTrigger from "../general/TooltipTrigger";
import { set } from "react-hook-form";
import { SocketContext } from "../socket/Socket";
import MemberView from "./MemberView";

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
  const [isShowModal, setIsShowModal] = useState(false);
  const [linkShare, setLinkShare] = useState(``);
  const socket = useContext(SocketContext);

  const handleClose = () => setIsShowModal(false);
  const handleShow = () => setIsShowModal(true);

  const handleClick = (index) => {
    const data = {
      indexSlide: index,
      listOfSlide: listOfSlides,
    };
    socket.emit('clickedSlide', data);
    setSelectedIndex(index);
  };

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (listOfSlideTypes.length === 0) {
      getSlideTypes()
        .then((data) => {
          setListofSlideTypes(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (presentInfo.length === 0) {
      getNameAndCreator(params.presentId)
        .then((data) => {
          setPresentInfo(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getAllSlides(params.presentId)
      .then((data) => {
        setListOfSlides(data);
      })
      .catch((err) => {
        console.log(err);
      });

    socket.on("submitSlide", (data) => {
      console.log(data);
      setListOfSlides(data);
    });
    const data = {
      indexSlide: selectedIndex,
      listOfSlide: listOfSlides,
    };
    socket.emit('clickedSlide', data);
    
    setLinkShare(`${process.env.REACT_APP_FE}/share/slide/${params.presentId}`);

    return () => {
      socket.off("submitSlide", (data) => {
        setListOfSlides(data);
      });
    }

  }, [isFetch]);

  const backToPresentClick = () => {
    navigate(`/presentations/${params.groupId}`);
  };

  const onChangeType = (typeId, typeName) => {
    const newList = [...listOfSlides];

    newList[selectedIndex].types_id = typeId;
    newList[selectedIndex]["type.types_name"] = typeName;

    setListOfSlides(newList);
  };

  const createSlideClick = () => {
    addSlide(params.presentId, 0, "").catch((err) => {
      console.log(err);
    });
    const flag = !isFetch;
    setIsFetch(flag);
  };

  const FetchListOfSlide = () => {
    const flag = !isFetch;
    setIsFetch(flag);
  };

  const handleDelete = () => {
    if (selectedIndex < listOfSlides.length && selectedIndex >= 0) {
      console.log(listOfSlides[selectedIndex].slides_id);
      deleteSlide(listOfSlides[selectedIndex].slides_id);
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="boxSlide1 slide-header">
        <Button
          variant="outline-dark"
          className="back-btn"
          onClick={backToPresentClick}
        >
          <BsFillCaretLeftFill />
        </Button>
        <div>
          <h4 className="title">{presentInfo.presents_name}</h4>
          <span className="credit">
            Created by {presentInfo["user.users_name"]}
          </span>
        </div>
      </div>
      <div className="boxSlide1 slide-toolbar">
        <Button onClick={createSlideClick}>+ New slide</Button>
        <div className="float-right">
          <TooltipTrigger text="Share slides">
            <Button onClick={handleShow}>
              Share
            </Button>
          </TooltipTrigger>
          <TooltipTrigger text="Delete slide">
            <Button variant="outline-danger" onClick={handleDelete}>
              <BsFillTrashFill />
            </Button>
          </TooltipTrigger>
          <TooltipTrigger text="Present slides">
            <Button variant="outline-success">
              <BsFillPlayCircleFill />
            </Button>
          </TooltipTrigger>
        </div>
      </div>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <div className="boxSlide5">
              {listOfSlides.map((slide, i) => (
                <div
                  key={slide.slides_id}
                  className={
                    listOfSlides[selectedIndex].slides_id === slide.slides_id
                      ? "clicked"
                      : "boxSlide4"
                  }
                  style={{ float: "left" }}
                  onClick={() => handleClick(i)}
                >
                  <div
                    style={{ display: "inline-block", float: "inline-start" }}
                  >
                    <span>{i + 1}</span>
                  </div>
                  <div
                    className="boxSlide2"
                    style={{ display: "inline-block", marginLeft: "3px" }}
                  >
                    {slide.types_id === 0 && <div />}
                    {slide.types_id === 1 && (
                      <Bar
                        width="150px"
                        height="100px"
                        data={{
                          labels: Object.keys(listOfSlides[i].options),
                          datasets: [
                            {
                              label: listOfSlides[i].question,
                              backgroundColor: ["#3e95cd", "#8e5ea2"],
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col xs={7} className="slide-edit-center">
            <MainView
              selectedIndex={selectedIndex}
              listOfSlides={listOfSlides}
            />
          </Col>
          <Col xs={3}>
            <EditSlide
              selectedIndex={selectedIndex}
              listOfSlides={listOfSlides}
              listOfSlideTypes={listOfSlideTypes}
              onChangeType={onChangeType}
              FetchListOfSlide={FetchListOfSlide}
            />
          </Col>
        </Row>
        <Modal show={isShowModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>My Share Link Slide</Modal.Title>
          </Modal.Header>
          <Modal.Body>Link: <a href={linkShare}>{linkShare}</a></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
