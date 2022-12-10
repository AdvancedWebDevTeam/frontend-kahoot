import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getAllSlides, getNameAndCreator } from "../../fetch/slideFetch";
import EditSlide from "./EditSlide";
import MainView from "./MainView";
import "./Slide.css";

export default function Slide() {
  const [listOfSlides, setListOfSlides] = useState([]);
  const [presentInfo, setPresentInfo] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getNameAndCreator(params.presentId)
      .then((data) => {
        setPresentInfo(data);
      })
      .catch((err) => {
        console.log(err);
      });

    getAllSlides(params.presentId)
      .then((data) => {
        setListOfSlides(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const BackToPresent_Click = () => {
    navigate(`/presentations/${params.groupId}`);
  };

  return (
    <div>
      <div className="boxSlide1 slide-header">
        <Button
          onClick={BackToPresent_Click}
          className="back-btn"
          variant="outline-secondary"
        >
          🔙
        </Button>
        <div>
          <h4 className="title">{presentInfo.presents_name}</h4>
          <p className="credit">Created by {presentInfo["user.users_name"]}</p>
        </div>
      </div>
      <div className="boxSlide1 slide-toolbar">
        <Button>+ New slide</Button>
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
                  <div style={{ display: "inline-block" }}>
                    <h5>{i + 1}</h5>
                  </div>
                  <div
                    className="boxSlide2"
                    style={{ display: "inline-block", marginLeft: "3px" }}
                  >
                    <h5>{slide.slides_id}</h5>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col xs={6} className="bg-gray" style={{padding: "1rem 2rem"}}>
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
      </Container>
    </div>
  );
}
