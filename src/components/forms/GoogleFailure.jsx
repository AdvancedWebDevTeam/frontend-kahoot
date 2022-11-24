import { Link } from "react-router-dom";
import "./verify.css";
import errorImage from "./error404.png";

export default function LoginGoogleFail() {
  return (
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
      <Link to="/">
        <button
          className="red_btn"
          style={{ margin: "0px auto", display: "block" }}
        >
          Login
        </button>
      </Link>
    </div>
  );
}
