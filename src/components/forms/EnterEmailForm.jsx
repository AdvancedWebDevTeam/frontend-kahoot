import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import "./Forms.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

export default function EnterEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);

  useEffect(() => {
    setStatus(0);
  }, [isValid]);

  const { mutate, isLoading } = useMutation(async (data) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/enteremail`, {
        email: data.email
      })
      .then((res) => {
        setStatus(res.status);
      })
      .catch((error) => {
        setStatus(error.response.status);
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
            <h3 className="auth-title">Forgot password</h3>
            <p className="auth-subtitle">
              Enter the email address you want to recover password.
            </p>
            <Form.Group className="md-3">
              <Form.Control
                id="email"
                type="email"
                placeholder="Your email"
                {...register("email", { required: true })}
              />
            </Form.Group>
            {errors.email?.type === "required" && (
              <Form.Text className="text-danger" role="alert">
                <div>Required</div>
              </Form.Text>
            )}
            {status === 405 && (
              <Form.Text className="text-danger" role="alert">
                <h5>Email does not exist</h5>
              </Form.Text>
            )}
            {status === 200 && (
              <Form.Text className="text-success" role="alert">
                <h5>
                  Visit your email to reset password. Token is about to expire
                  in 15 minute
                </h5>
              </Form.Text>
            )}
            <div className="auth-btn-group">
              <Button variant="primary" type="submit">
                <strong>Submit</strong>
              </Button>
              <div className="strike">
                <p>Or you can go back to sign in</p>
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
      </Row>
    </Container>
  );
}
