import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import successImage from "./success.png";
import errorImage from "./error404.png";

import "./verify.css";

export default function VerifyForm() {
  const params = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    const token = params.token;
    const exp = JSON.parse(atob(token.split(".")[1])).exp;
    const curtime = Math.floor(Date.now() / 1000);
    if(curtime > exp) {
      setValidUrl(false);
    }
    else {
      await axios
      .patch(
        `${process.env.REACT_APP_API_URL}/users/${params.id}/verify/${params.token}`
      )
      .then((res) => {
        setValidUrl(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <div>
      {validUrl === true ? (
        <div className="box-verify" style={{ marginTop: "10%" }}>
          <img
            src={successImage}
            alt="success_img"
            style={{ margin: "0px auto", display: "block" }}
          />
          <h1 style={{ textAlign: "center" }}>Email verified successfully</h1>
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
    </div>
  );
}
