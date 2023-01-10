import "./verify.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import successImage from "./success.png";

export default function LoginGoogleSuccess() {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("accessToken", JSON.stringify(params.token));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, []);
  return (
    <Container fluid>
      <Row>
        <Col>
          <img
            src={successImage}
            alt="success_img"
            style={{
              margin: "6rem auto 1rem",
              display: "block",
              borderRadius: "50px"
            }}
          />
          <h1 style={{ textAlign: "center" }}>Login successfully</h1>
        </Col>
      </Row>
    </Container>
  );
}
