import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import { Form, Button, Container, Row, Col } from "react-bootstrap";

import "./Forms.css";
import "./verify.css";
import errorImage from "./error404.png";

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const params = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);
  const [isExpire, setIsExpire] = useState(false);

  const checkIsExpire = () => {
    const resetToken = params.token;
    const { exp } = JSON.parse(atob(resetToken.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= exp) {
      setIsExpire(true);
    }
  };

  useEffect(() => {
    checkIsExpire();
  }, []);

  const sendData = async (data, id) => {
    await axios
      .patch(`${process.env.REACT_APP_API_URL}/users/resetpassword`, {
        confirmPassword: data.confirmpassword,
        userId: id
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setStatus(error.response.status);
      });
  };

  const onHandleSubmit = (data) => {
    const resetToken = params.token;
    const { id } = JSON.parse(atob(resetToken.split(".")[1]));
    sendData(data, id);
  };

  return (
    <Container fluid>
      {isExpire === false ? (
        <Row
          className="auth-row"
          style={{ backgroundImage: `url(/login-bg.jpg)` }}
        >
          <Col className="auth-box" md={3}>
            <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
              <h3 className="auth-title">Reset your password</h3>
              <Form.Group className="md-3">
                <Form.Label>New password</Form.Label>
                <Form.Control
                  id="newpassword"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newpassword", { required: true })}
                />
              </Form.Group>
              {errors.newpassword?.type === "required" && (
                <Form.Text className="text-danger" role="alert">
                  Required
                </Form.Text>
              )}
              <Form.Group className="md-3">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  id="confirmpassword"
                  type="password"
                  placeholder="Enter confirm password"
                  {...register("confirmpassword", {
                    required: true,
                    validate: (val) => {
                      return watch("newpassword") === val;
                    }
                  })}
                />
              </Form.Group>
              {errors.confirmpassword?.type === "required" && (
                <Form.Text className="text-danger">
                  <div>Required</div>
                </Form.Text>
              )}
              {errors.confirmpassword?.type === "validate" && (
                <Form.Text className="text-danger">
                  <div>Your passwords do no match</div>
                </Form.Text>
              )}
              {status === 405 && (
                <Form.Text className="text-danger">
                  <h5>Fail to reset password</h5>
                </Form.Text>
              )}

              <div className="auth-btn-group">
                <Button variant="primary" type="submit">
                  Reset
                </Button>
              </div>
            </Form>
          </Col>
          <Col className="auth-text-container" md={{ span: 5, offset: 2 }}>
            <h1>WELCOME BACK TO</h1>
            <h1>
              <strong>PRESENT & STUDY</strong>
            </h1>
            <h2>Learn and share knowledge</h2>
            <p>
              Join a group, watch a presentation, ask questions,... You can
              learn from others as much as others can learn from you.
            </p>
          </Col>
        </Row>
      ) : (
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
          </Col>
        </Row>
      )}
    </Container>
  );
}
