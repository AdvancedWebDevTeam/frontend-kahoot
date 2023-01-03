import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import { Form, Button, Container } from "react-bootstrap";

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
    const exp = JSON.parse(atob(resetToken.split(".")[1])).exp;
    const curtime = Math.floor(Date.now() / 1000);
    if(curtime - exp > 900) { // lon hon 15 phut hoac 15 * 60 = 900 giay
      setIsExpire(true);
    }
  }
  
  useEffect(() => {
    checkIsExpire();
  }, [])

  const sendData = async (data, id) => {
    await axios
    .patch(`${process.env.REACT_APP_API_URL}/users/resetpassword`, {
      confirmPassword: data.confirmpassword,
      userId: id
    })
    .then((res) => {
      navigate("/");
    })
    .catch((error) => {
      console.log(error);
      setStatus(error.response.status);
    });
  }

  const onHandleSubmit = (data) => {
    const resetToken = params.token;
    const id = JSON.parse(atob(resetToken.split(".")[1])).id;
    sendData(data, id);
  }

  return (
    <Container type="fluid">
      {isExpire === false ? (
        <div className="box" style={{ marginTop: "10%" }}>
          <h3>Reset password</h3>
          <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
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
                {...register("confirmpassword",
                  {
                    required: true,
                    validate: (val) => {
                      if(watch("newpassword") !== val) {
                        return false;
                      }
                      else {
                        return true;
                      }
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
            <div>
              <Button
                variant="primary"
                type="submit"
                style={{ marginTop: "10px" }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="box-verify" style={{ marginTop: "10%" }}>
          <img
            src={errorImage}
            style={{
              height: "200px",
              width: "200px",
              margin: "0px auto",
              display: "block"
            }}
            alt="error404_img"
          />
          <h1 style={{ textAlign: "center" }}>404 Not Found</h1>
        </div>
      )}
    </Container>
  );
}
