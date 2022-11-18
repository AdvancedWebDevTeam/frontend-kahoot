import "./verify.css";
import successImage from "./success.png";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function LoginGoogleSuccess()
{
    const params = useParams();
    useEffect(() => {
        localStorage.setItem("accessToken", JSON.stringify(params.token));
    }, [])
    return(
        <div className="box-verify" style={{ marginTop: "10%" }}>
          <img
            src={successImage}
            alt="success_img"
            style={{ margin: "0px auto", display: "block" }}
          />
          <h1 style={{ textAlign: "center" }}>An email has sent to verify</h1>
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