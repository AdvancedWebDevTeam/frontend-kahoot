import { Link } from "react-router-dom";
import "./verify.css";
import { Col, Container, Row } from "react-bootstrap";
import errorImage from "./error404.png";

export default function LoginGoogleFail() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <img
            src={errorImage}
            style={{
              height: "200px",
              width: "200px",
              margin: "6rem auto 1rem",
              display: "block"
            }}
            alt="error404_img"
          />
          <h1 style={{ textAlign: "center" }}>404 Not Found</h1>
          <Link to="/">
            <button
              type="button"
              className="red_btn"
              style={{ margin: "1rem auto", display: "block" }}
            >
              Try to login again
            </button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
