import "./verify.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import successImage from "./success.png";

export default function LoginGoogleSuccess() {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("accessToken", JSON.stringify(params.token));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, []);
  return (
    <div className="box-verify" style={{ marginTop: "10%" }}>
      <img
        src={successImage}
        alt="success_img"
        style={{ margin: "0px auto", display: "block" }}
      />
      <h1 style={{ textAlign: "center" }}>Login successfully</h1>
    </div>
  );
}
