import React, { useContext, useEffect, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  Modal,
  OverlayTrigger,
  Popover,
  Form
} from "react-bootstrap";

import { SocketContext } from "../socket/Socket";
import "./MemberView.css";
import { getSlidePresent, getSubmitContent, submitSlide } from "../../fetch/slideFetch";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import headingImg from "./heading.png";
import paragraphImg from "./paragraph.png";
import Chat from "../chat/Chat";
import { getMembersInGroup } from "../../fetch/groupFetch";
import { getLoggedInUserId } from "../../util/ultilis";

export default function MemberView() {
  const [slide, setSlide] = useState([]);
  const [presentId, setPresentID] = useState("");
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const socket = useContext(SocketContext);
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const userID = getLoggedInUserId();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    socket.on("clickedSlide", (data) => {
      if (data.listOfSlide[data.indexSlide] === undefined) {
        navigate("/");
      }
      setSlide(data.listOfSlide[data.indexSlide]);
      getSubmitContent(data.listOfSlide[data.indexSlide]?.slides_id)
        .then((data) => {
          const submit = data.find((element) => element.users_id === userID);
          if (submit && userID !== null) {
            setIsSubmitted(true);
          } else {
            setIsSubmitted(false);
          }
        });
      setOptions(
        Object.getOwnPropertyNames(data.listOfSlide[data.indexSlide]?.options)
      );
      setPresentID(data.listOfSlide[data.indexSlide]?.presents_id);
    });

    socket.on("NotifyMessage", () => {
      setCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("clickedSlide");
      socket.off("NotifyMessage");
    };
  }, [socket]);

  useEffect(() => {
    if (param.access === "private") {
      getMembersInGroup(param.groupId).then((data) => {
        const userInGroup = data.find((element) => element.userId === userID);
        if (userInGroup === undefined) {
          setShowModal(true);
        }
      });
    }
    
    getSlidePresent(param.presentId)
      .then((data) => {
        if (data.listOfSlides[data.indexSlide.index_slide] === undefined) {
          navigate("/");
        }
        setSlide(data.listOfSlides[data.indexSlide.index_slide]);
        getSubmitContent(data.listOfSlides[data.indexSlide.index_slide]?.slides_id)
        .then((data) => {
          const submit = data.find((element) => element.users_id === userID);
          if (submit && userID !== null) {
            setIsSubmitted(true);
          }
        });
        setOptions(
          Object.getOwnPropertyNames(
            data.listOfSlides[data.indexSlide.index_slide]?.options
          )
        );
        setPresentID(data.indexSlide?.presents_id);
      })
      .catch((err) => console.log(err));
  }, [slide.types_id, options]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (result !== "") {
      submitSlide(presentId, slide.slides_id, slide.question, result, new Date(), userID);
      setResult("");
      setShowAlert(true);
      setIsSubmitted(true);
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <Chat />
      </Popover.Body>
    </Popover>
  );

  const alert = (
    <Alert dismissible onClose={() => setShowAlert(false)}>
      Your choice is submitted!
    </Alert>
  );

  return (
    <>
      <Modal show={showModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are not in this group.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onCloseModal}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
      {param.access === "private" && token === null && (
        <Navigate to="/login" state={{ from: location }} />
      )}
      {showAlert && alert}
      <div className="containerMemberView">
        {token !== null && (
          <OverlayTrigger trigger="click" placement="left" overlay={popover}>
            <Button variant="success" onClick={() => setCount(0)}>
              Box chat <Badge bg="secondary">{count !== 0 && count}</Badge>
            </Button>
          </OverlayTrigger>
        )}
        {slide.types_id === 0 ? (
          <h1 className="typeslidetyle">Blank Slide</h1>
        ) : slide.types_id === 1 ? (
          <>
            <h1 className="typeslidetyle">Multiple Choice</h1>
            <div className="questionstyle">Question: {slide.question}</div>
            <Form onSubmit={(e) => onSubmit(e)}>
              {options.map((item) => (
                <div
                  className={
                    result === item
                      ? "mb-3 containercbxFocus"
                      : "mb-3 containercbx"
                  }
                  key={`inline-${item}`}
                >
                  <Form.Check
                    onChange={(e) => setResult(e.target.id)}
                    label={item}
                    name="group1"
                    type="radio"
                    checked={result === item}
                    id={item}
                  />
                </div>
              ))}
              <Button variant="primary" type="submit" className="btnSubmit" disabled={isSubmitted}>
                Submit
              </Button>
              {isSubmitted && <Form.Text>You have already submitted!</Form.Text>}
            </Form>
          </>
        ) : slide.types_id === 2 ? (
          <>
            <h2 className="headingstyle">{slide.headingOfHeading}</h2>
            <div className="paragraph-style-member">{slide.subheading}</div>
            <img
              className="imageslidestyle"
              alt="heading image"
              src={headingImg}
            />
          </>
        ) : (
          <>
            <h2 className="headingstyle">{slide.headingOfParagraph}</h2>
            <div className="paragraph-style-member">{slide.paragraph}</div>
            <img
              className="imageslidestyle"
              alt="paragraph image"
              src={paragraphImg}
            />
          </>
        )}
      </div>
    </>
  );
}
