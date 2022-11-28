import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import axios from "axios";

import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Form, Button, Row, Col, Accordion, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function UserProfile() {
  const [isEdit, setIsEdit] = useState(false);

  const [isMatch, setIsMatch] = useState(false);

  const [user, setUser] = useState({
    email: "",
    users_name: "",
    users_password: ""
  });

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    await axios.get(`${process.env.REACT_APP_API_URL}/users/${parseJwt(token).user.users_id}`).then((response) => {
      setUser(response.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { mutate } = useMutation(async (data) => {
    const token = localStorage.getItem("accessToken");
    await axios
      .put(`${process.env.REACT_APP_API_URL}/users/update`, {
        users_id: parseJwt(token).user.users_id,
        users_name: data.users_name,
        email: data.email,
        password:
          data.users_password === undefined
            ? user.users_password
            : data.users_password
      })
      .then(() => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch,
    formState: { errors: errors2 }
  } = useForm();

  const nowChangePassword = watch("NewPs", "");

  const onSubmit = (data) => {
    setIsEdit(!isEdit);
    mutate(data);
  };

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const onCancel = () => {
    setIsEdit(!isEdit);
  };

  const onChangePassword = (data) => {
    const newUserInfo = user;
    newUserInfo.users_password = data.CfNewPs;
    setUser(newUserInfo);
    mutate(user);
  };

  const checkPassword = async (e) => {
    const token = localStorage.getItem("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/${parseJwt(token).user.users_id}/${e.target.value}`)
      .then((res) => {
        if (res.data === 'Right password') {
          setIsMatch(true);
        }
        else {
          setIsMatch(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Card className="card">
        <Card.Header>User Profile</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <Form.Group className="mb-3">
              <Form.Label>Username: </Form.Label>
              {isEdit === false ? (
                <Form.Control
                  id="users_name"
                  placeholder="Enter username"
                  value={user.users_name}
                  {...register("users_name", { required: true })}
                  disabled
                />
              ) : (
                <Form.Control
                  id="users_name"
                  placeholder="Enter username"
                  {...register("users_name", { required: true })}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              {isEdit === false ? (
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={user.email}
                  {...register("email", { required: true })}
                  disabled
                />
              ) : (
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", { required: true })}
                />
              )}
            </Form.Group>
            {isEdit === true ? (<>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button className="cancel" variant="primary" onClick={onCancel}>
                Cancel
              </Button>
            </>
            ) : (
              <Button variant="primary" onClick={onEdit}>
                Edit
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
      <Accordion className='card'>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Change Password</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit2((data) => onChangePassword(data))}>
              <Row>
                <Col>
                  <Form.Control placeholder="Enter now password" id="nowPassword" {...register2("nowPassword", { required: "Please fill out your now password", validate: value => isMatch || "Does not match!" })} onChange={(e) => checkPassword(e)} />
                  <Form.Text className='error'>{errors2.nowPassword?.message}</Form.Text>
                </Col>
                <Col>
                  <Form.Control placeholder="Enter new password" id="NewPs" {...register2("NewPs", { required: "You must specify a new password" })} />
                  <Form.Text className='error'>{errors2.NewPs?.message}</Form.Text>
                </Col>
                <Col>
                  <Form.Control placeholder="Confirm new password" id="CfNewPs"
                    type="CfNewPs"
                    {...register2("CfNewPs", { required: "You must specify a confirm new password", validate: value => value === nowChangePassword || "Does not match with new password!" })} />
                  <Form.Text className='error'>{errors2.CfNewPs?.message}</Form.Text>
                </Col>
              </Row>
                <Button variant="primary" type='submit' className="btnChangePass">
                  Submit
                </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}
