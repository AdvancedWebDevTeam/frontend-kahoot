import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import successImage from "./success.png";
import errorImage from "./error404.png";
import "./verify.css";

export default function VerifyForm() {
  const params = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    const { token } = params;
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const curtime = Math.floor(Date.now() / 1000);
    if (curtime >= exp) {
      setValidUrl(false);
    } else {
      await axios
        .patch(
          `${process.env.REACT_APP_API_URL}/users/${params.id}/verify/${params.token}`
        )
        .then(() => {
          setValidUrl(true);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        });
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          {validUrl === false ? (
            <div className="box-verify" style={{ marginTop: "10%" }}>
              <img
                src={successImage}
                alt="success_img"
                style={{
                  margin: "0px auto",
                  display: "block",
                  borderRadius: "50px"
                }}
              />
              <h1 style={{ textAlign: "center" }}>
                Email verified successfully
              </h1>
            </div>
          ) : (
            <>
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
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
