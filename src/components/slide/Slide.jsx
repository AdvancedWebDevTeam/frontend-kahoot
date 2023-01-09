import { useState, useEffect, useCallback, useContext } from "react";
import {
  Badge,
  Button,
  Container,
  Modal,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
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
  BsFillTrashFill,
  BsChevronRight,
  BsChevronLeft
} from "react-icons/bs";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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
import { SocketContext } from "../socket/Socket";
import paragraphImg from "./paragraph.png";
import Chat from "../chat/Chat";
import headingImg from "./heading.png";
import { getLoggedInUserId } from "../../util/ultilis";
import MemberChoiceModal from "./MemberChoiceModal";

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
  const [currentUserId, setCurrentUserId] = useState("");
  const [countMess, setCountMess] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [countHistory, setCountHistory] = useState(0);

  const socket = useContext(SocketContext);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <Chat />
      </Popover.Body>
    </Popover>
  );

  const handleClose = () => setIsShowModal(false);
  const handleShow = () => {
    if (presentInfo.groups_id === null) {
      setLinkShare(
        `${process.env.REACT_APP_FE}/share/public/slide/mypresent/${params.presentId}`
      );
    } else {
      setLinkShare(
        `${process.env.REACT_APP_FE}/share/private/slide/${presentInfo.groups_id}/${params.presentId}`
      );
    }
    setIsShowModal(true);
  };

  const handleClick = (index) => {
    const data = {
      presents_id: params.presentId,
      indexSlide: index,
      listOfSlide: listOfSlides
    };
    socket.emit("clickedSlide", data);
    setSelectedIndex(index);
  };

  const navigate = useNavigate();
  const params = useParams();

  const fullscreenHandle = useFullScreenHandle();
  const [isOnFullScreen, setIsOnFullScreen] = useState(false);

  useEffect(() => {
    getAllSlides(params.presentId)
      .then((data) => {
        setListOfSlides(data);
      })
      .catch((err) => {
        console.log(err);
      });

    const data = {
      presents_id: params.presentId,
      indexSlide: selectedIndex,
      listOfSlide: listOfSlides
    };

    socket.emit("clickedSlide", data);
  }, [isFetch]);

  useEffect(() => {
    socket.on("submitSlide", (data) => {
      setListOfSlides(data);
      setCountHistory((prevCount) => prevCount + 1);
    });

    socket.on("NotifyMessage", () =>
      setCountMess((prevCount) => prevCount + 1)
    );

    return () => {
      socket.off("submitSlide");
      socket.off("NotifyMessage");
    };
  }, [socket]);

  useEffect(() => {
    setCurrentUserId(getLoggedInUserId());

    getSlideTypes()
      .then((data) => {
        setListofSlideTypes(data);
      })
      .catch((err) => {
        console.log(err);
      });

    getNameAndCreator(params.presentId)
      .then((data) => {
        setPresentInfo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const backToPresentClick = () => {
    navigate(`/presentations/${params.groupId}`);
  };

  const onChangeType = (typeId, typeName) => {
    const newList = [...listOfSlides];

    newList[selectedIndex].types_id = typeId;
    newList[selectedIndex]["type.types_name"] = typeName;

    setListOfSlides(newList);
  };

  const FetchListOfSlide = () => {
    const flag = !isFetch;
    setIsFetch(flag);
  };

  const createSlideClick = () => {
    addSlide(params.presentId, 0, "").catch((err) => {
      console.log(err);
    });
    FetchListOfSlide();
  };

  function presentSlides() {
    fullscreenHandle.enter();
    socket.emit("NotifyPresentation", { presentInfo, currentUserId });
  }

  const onFullscreenChange = useCallback(
    (state) => {
      setIsOnFullScreen(state);
    },
    [fullscreenHandle]
  );

  function moveToNextSlide() {
    if (selectedIndex < listOfSlides.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(0);
    }
  }

  function moveToPrevSlide() {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else {
      setSelectedIndex(listOfSlides.length - 1);
    }
  }

  const navSlideButtons = isOnFullScreen && (
    <>
      <Button
        className="nav-btn prev"
        variant="outline-secondary"
        onClick={moveToPrevSlide}
      >
        <BsChevronLeft />
      </Button>
      <Button
        className="nav-btn next"
        variant="outline-secondary"
        onClick={moveToNextSlide}
      >
        <BsChevronRight />
      </Button>
    </>
  );

  const handleDelete = () => {
    if (selectedIndex < listOfSlides.length && selectedIndex >= 0) {
      deleteSlide(listOfSlides[selectedIndex].slides_id);
      FetchListOfSlide();
    }
  };

  return (
    <>
      <div className="boxSlide1 slide-header">
        {params.groupId !== "mypresent" && (
          <Button
            variant="outline-dark"
            className="back-btn"
            onClick={backToPresentClick}
          >
            <BsFillCaretLeftFill />
          </Button>
        )}
        <div>
          <h4 className="title">{presentInfo.presents_name}</h4>
          <span className="credit">Created by {presentInfo.users_name}</span>
        </div>
      </div>
      <div className="boxSlide1 slide-toolbar">
        <Button onClick={createSlideClick}>+ New slide</Button>
        <div className="float-right">
          <OverlayTrigger trigger="click" placement="left" overlay={popover}>
            <Button variant="success" onClick={() => setCountMess(0)}>
              Box chat{" "}
              <Badge bg="secondary">{countMess !== 0 && countMess}</Badge>
            </Button>
          </OverlayTrigger>
          <TooltipTrigger text="History Submit">
            <Button onClick={() => {setShowHistory(true);
                                    setCountHistory(0)}}>
              History{" "}
              <Badge bg="secondary">{countHistory !== 0 && countHistory}</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipTrigger text="Share slides">
            <Button onClick={handleShow}>Share</Button>
          </TooltipTrigger>
          <TooltipTrigger text="Delete slide">
            <Button variant="outline-danger" onClick={handleDelete}>
              <BsFillTrashFill />
            </Button>
          </TooltipTrigger>
          <TooltipTrigger text="Present slides">
            <Button variant="outline-success" onClick={presentSlides}>
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
                    {slide.types_id === 2 && (
                      <div>
                        <div>
                          <img alt="heading image" src={headingImg} />
                        </div>
                        <div
                          className="heading-style"
                          style={{ marginTop: "10%" }}
                        >
                          {slide.headingOfHeading}
                        </div>
                        <div className="subheading-style">
                          {slide.subheading}
                        </div>
                      </div>
                    )}
                    {slide.types_id === 3 && (
                      <div>
                        <div>
                          <img alt="heading image" src={paragraphImg} />
                        </div>
                        <div
                          className="heading-style"
                          style={{ marginTop: "10%" }}
                        >
                          {slide.headingOfParagraph}
                        </div>
                        <div className="paragraph-style">{slide.paragraph}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col xs={7} className="slide-edit-center">
            <FullScreen handle={fullscreenHandle} onChange={onFullscreenChange}>
              <MainView
                selectedIndex={selectedIndex}
                listOfSlides={listOfSlides}
              />
              {navSlideButtons}
            </FullScreen>
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
          <Modal.Body>
            Link: <a href={linkShare}>{linkShare}</a>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <MemberChoiceModal
        slideId={listOfSlides[selectedIndex]?.slides_id}
        show={showHistory}
        handleCloseHistory={() => setShowHistory(false)}
        countHistory={countHistory}/>
    </>
  );
}
