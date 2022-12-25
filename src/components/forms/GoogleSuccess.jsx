import "./verify.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import successImage from "./success.png";

export default function LoginGoogleSuccess() {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("accessToken", JSON.stringify(params.token));
    navigate("/")
  }, []);
  return (
    <div className="box-verify" style={{ marginTop: "10%" }}>
      <img
        src={successImage}
        alt="success_img"
        style={{ margin: "0px auto", display: "block" }}
      />
      <h1 style={{ textAlign: "center" }}>Login successfully</h1>
      <Link to="/">
        <button
          className="green_btn"
          style={{ margin: "0px auto", display: "block" }}
        >
          Back to home page
        </button>
      </Link>
    </div>
  );
}
