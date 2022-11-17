import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import "./Forms.css";
import { Form, Button, Container } from "react-bootstrap";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);
  const [isVerify, setIsVerify] = useState(-1);

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
      })
      .catch((error) => {
        console.log(error);
        setStatus(error.response.status);
      });
  });

  const onHandleSubmit = (data) => {
    mutate(data);
  };

  const buttonLogin_Clicked = () => {
    navigate("/login");
  };

  if (isLoading) {
      return (<div className='center'><div className='ring'><div className='decorate'>Loading...</div></div></div>)
  }

  return (
    <Container type="fluid">
      <div className="box" style={{ marginTop: "10%" }}>
        <h3>Registeration form</h3>
        <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
          <Form.Group className="md-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              id="username"
              type="text"
              placeholder="Username"
              {...register("username", { required: true, maxLength: 20 })}
            />
          </Form.Group>
          {errors.username?.type === "required" && (
            <Form.Text className="text-danger" role="alert">
              username is required
            </Form.Text>
          )}
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
              email is required
            </Form.Text>
          )}
          <Form.Group className="md-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              placeholder="Password"
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
              <h4>Your account already exists</h4>
            </Form.Text>
          )}
          {isVerify === 0 && (
            <Form.Text className="text-danger">
              <h4>An email has sent to verify your account</h4>
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
