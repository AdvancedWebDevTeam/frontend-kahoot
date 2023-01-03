import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import "./Forms.css";
import { Form, Button, Container } from "react-bootstrap";

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
  }, [isValid])

  const sendData = async (data) => {
    await axios
    .post(`${process.env.REACT_APP_API_URL}/users/enteremail`, {
      email: data.email,
    })
    .then((res) => {
      //console.log(res.data);
      setStatus(res.status);
    })
    .catch((error) => {
      console.log(error);
      setStatus(error.response.status);
    });
  }

  const onHandleSubmit = (data) => {
   sendData(data);
  }

  const buttonLogin_Clicked = () => {
    navigate("/login");
  }

  return (
    <Container type="fluid">
      <div className="box" style={{ marginTop: "10%" }}>
        <h3>Forgot password</h3>
        <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
          <Form.Group className="md-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              type="email"
              placeholder="Enter email"
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
              <h5>Visit your email to reset password. Token is about to expire in 15 minute</h5>
            </Form.Text>
          )}
          <div className="allign">
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </div>
          <div className="allign">
            <Button
              variant="primary"
              type="button"
              style={{ marginTop: "10px" }}
              onClick={buttonLogin_Clicked}
            >
              Sign In
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
