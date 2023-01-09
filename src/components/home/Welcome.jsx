import "./Home.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserId } from "../../util/ultilis";

export default function Welcome() {
  const userId = getLoggedInUserId();
  const navigate = useNavigate();

  const buttonsGroup = userId ? (
    <>
      <Button
        variant="primary"
        style={{ marginRight: ".5rem" }}
        onClick={() => navigate("/group")}
      >
        My groups
      </Button>
      <Button
        variant="outline-primary"
        onClick={() => navigate(`/presentations/mypresent/${userId}`)}
      >
        Presentations
      </Button>
    </>
  ) : (
    <>
      <Button
        variant="primary"
        style={{ marginRight: ".5rem" }}
        onClick={() => navigate("/login")}
      >
        Sign in
      </Button>
      <Button variant="outline-secondary" onClick={() => navigate("/register")}>
        Create an account
      </Button>
    </>
  );

  return (
    <Container className="welcome-container flex-center">
      <Row>
        <Col className="flex-center flex-display-column">
          <div className="welcome-text-container">
            <h1> WELCOME TO </h1>
            <h1>
              <strong>PRESENT & STUDY</strong>
            </h1>
            <h2>Learn and share knowledge</h2>
            <p>
              Join a group, watch a presentation, ask questions,... You can
              learn from others as much as others can learn from you.
            </p>
            <p className="text-underlined">Jump in and start learning now!</p>
            <div>{buttonsGroup}</div>
          </div>
        </Col>
        <Col>
          <img
            className="welcome-img"
            src="/welcome-img.jpg"
            alt="people studying together"
          />
        </Col>
      </Row>
    </Container>
  );
}
