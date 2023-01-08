import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import "./Forms.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);
  const [isVerify, setIsVerify] = useState(-1);
  const [message, setMessage] = useState("");

  const { mutate, isLoading } = useMutation(async (data) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users`, {
        username: data.username,
        email: data.email,
        password: data.password
      })
      .then((res) => {
        setStatus(res.status);
        setIsVerify(0);
        setMessage("");
      })
      .catch((error) => {
        setStatus(error.response.status);
        setMessage(error.response.data);
      });
  });

  const onHandleSubmit = (data) => {
    mutate(data);
  };

  const buttonLoginClicked = () => {
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="center">
        <div className="ring">
          <div className="decorate">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row
        className="auth-row"
        style={{ backgroundImage: `url(/login-bg.jpg)` }}
      >
        <Col className="auth-box" md={3}>
          <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
            <h3 className="auth-title">Welcome!</h3>
            <Form.Group className="md-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                id="username"
                type="text"
                placeholder="Your username"
                {...register("username", { required: true, maxLength: 20 })}
              />
            </Form.Group>
            {errors.username?.type === "required" && (
              <Form.Text className="text-danger" role="alert">
                username is required
              </Form.Text>
            )}
            <Form.Group className="md-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </Form.Group>
            {errors.email?.type === "required" && (
              <Form.Text className="text-danger" role="alert">
                email is required
              </Form.Text>
            )}
            <Form.Group className="md-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                placeholder="..."
                {...register("password", { required: true })}
              />
            </Form.Group>
            {errors.password?.type === "required" && (
              <Form.Text className="text-danger">
                <div>password is required</div>
              </Form.Text>
            )}

            {status === 401 && (
              <Form.Text className="text-danger">
                <h5>{message}</h5>
              </Form.Text>
            )}
            {isVerify === 0 && (
              <Form.Text className="text-success">
                <h5>
                  An email has sent to verify your account. Token is about to
                  expire in 15 minutes
                </h5>
              </Form.Text>
            )}

            <div className="auth-btn-group">
              <Button variant="primary" type="submit">
                <strong>Sign up</strong>
              </Button>

              <div className="strike">
                <p>Already have an account?</p>
              </div>
              <Button
                variant="outline-primary"
                type="button"
                size="sm"
                onClick={buttonLoginClicked}
              >
                Sign In
              </Button>
            </div>
          </Form>
        </Col>
        <Col className="auth-text-container" md={{ span: 5, offset: 2 }}>
          <h1>WELCOME TO</h1>
          <h1>
            <strong>PRESENT & STUDY</strong>
          </h1>
          <h2>Learn and share knowledge</h2>
          <p>
            Join a group, watch a presentation, ask questions,... You can learn
            from others as much as others can learn from you.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
