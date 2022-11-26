import React from 'react'
import './UserProfile.css'
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Form, Button, Row, Col, Accordion, Container } from "react-bootstrap";
import Card from 'react-bootstrap/Card';

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default function UserProfile() {

  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  const [listGroup, setListGroup] = useState([<></>]);

  const [user, setUser] = useState({
    create_at: "",
    email: "",
    expire_at: "",
    groups_name: [],
    roles_name: [],
    users_name: "",
    users_passwords: ""
  });

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    await axios.get(`${process.env.REACT_APP_API_URL}/users/${parseJwt(token).user.users_id}`).then((response) => {
      setUser(response.data);
      if (response.data.groups_name[0] !== null) {
        let result = [];
        for (let i = 0; i < response.data.groups_name.length; i++) {
          result.push(<p>{response.data.groups_name[i] + ' <=> ' + response.data.roles_name[i]}</p>);
        }
        setListGroup(result);
      }
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
        users_name: data.username,
        email: data.email
      })
      .then((res) => {
        window.location.reload(false);
        console.log(res);
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
    formState: { errors: errors2 }
  } = useForm();

  const onSubmit = (data) => {
    setIsEdit(!isEdit);
    mutate(data);
  }

  const onEdit = () => {
    setIsEdit(!isEdit);
  }

  const onCancel = () => {
    setIsEdit(!isEdit);
  }

  const onChangePassword = (data) => {
    console.log(data);
    let newUserInfo = user;
    newUserInfo.password = data.CfNewPs;
    setUser(newUserInfo);
  }

  return (
    <>
      <Container>
        <Card className='card'>
          <Card.Header>User Profile</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
              <Form.Group className="mb-3">
                <Form.Label>Username: </Form.Label>
                {isEdit === false ? <Form.Control
                  id="username"
                  type="username"
                  placeholder="Enter username"
                  value={user.users_name}
                  {...register("username", { required: true })}
                  disabled /> : <Form.Control
                  id="username"
                  type="username"
                  placeholder="Enter username"
                  {...register("username", { required: true })}
                />}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                {isEdit === false ?
                  <Form.Control
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={user.email}
                    {...register("email", { required: true })} disabled /> :
                  (<Form.Control
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email", { required: true })} />
                  )
                }
              </Form.Group>
              <Row className='mb-3'>
                <Form.Group as={Col}>
                  <Form.Label>Create/Update At:</Form.Label>
                  <Form.Control type="createAt" placeholder="Date" disabled value={user.create_at} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Expire At:</Form.Label>
                  <Form.Control type="Expire At" placeholder="Date" disabled value={user.expire_at} />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Accordion className='group'>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Group-Role</Accordion.Header>
                    <Accordion.Body>
                      {listGroup}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Form.Group>
              {isEdit === true ? (<>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button className='cancel' variant="primary" onClick={onCancel}>
                  Cancel
                </Button>
              </>
              ) : (<Button variant="primary" onClick={onEdit}>
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
                    <Form.Control placeholder="Enter now password" />
                  </Col>
                  <Col>
                    <Form.Control placeholder="Enter new password" id="NewPs" {...register2("NewPs", { required: true })}/>
                  </Col>
                  <Col>
                    <Form.Control placeholder="Confirm new password" id="CfNewPs"
                      type="CfNewPs"
                      {...register2("CfNewPs", { required: true })} />
                  </Col>
                </Row>
                <Button variant="primary" type='submit'>
                  Submit
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  )
}
