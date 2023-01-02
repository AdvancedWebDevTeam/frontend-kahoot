import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import "./Forms.css";
import { Form, Button, Container } from "react-bootstrap";

export default function EnterEmailForm() {
  return (
    <Container type="fluid">
      <div className="box" style={{ marginTop: "10%" }}>
        <h3>Login form</h3>
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
              <h4>Your account is not exists</h4>
            </Form.Text>
          )}
          <div>
            <Link to="/">Forgot password</Link>
          </div>
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
              onClick={buttonRegister_Clicked}
            >
              Sign Up
            </Button>
          </div>
          <div className="allign">
            <Button
              variant="primary"
              type="button"
              style={{ marginTop: "10px" }}
              onClick={buttonRegisterByGoogle_Clicked}
            >
              Sign in with google
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
