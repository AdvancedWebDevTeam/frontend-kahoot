import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import "./Forms.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState(0);

  const { mutate, isLoading } = useMutation(async (data) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email: data.email,
        password: data.password
      })
      .then((res) => {
        localStorage.setItem("accessToken", JSON.stringify(res.data));
        setStatus(res.status);
        if (location.state?.from) {
          navigate(location.state.from);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setStatus(error.response.status);
      });
  });

  const onHandleSubmit = (data) => {
    mutate(data);
  };

  const buttonRegisterClicked = () => {
    navigate("/register");
  };

  const buttonRegisterByGoogleClicked = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/login/google`, "_self");
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
            <h3 className="auth-title">Jump to your study!</h3>
            <Form.Group className="md-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="email"
                type="email"
                placeholder="example@mail.com"
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
                <h5>Your account is not exists</h5>
              </Form.Text>
            )}

            <div style={{ margin: ".5rem 0" }}>
              <Link to="/forgotpassword">Forgot password</Link>
            </div>

            <div className="auth-btn-group">
              <Button variant="primary" type="submit">
                <strong>Sign in</strong>
              </Button>
              <div className="strike">
                <p>Or you can sign in with...</p>
              </div>
              <Button
                variant="light"
                type="button"
                onClick={buttonRegisterByGoogleClicked}
                className="login-btn-google"
              >
                <FcGoogle />
              </Button>
              <div className="strike">
                <p>New here? Create your account</p>
              </div>
              <Button
                variant="outline-primary"
                type="button"
                size="sm"
                onClick={buttonRegisterClicked}
              >
                Sign me up!
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
