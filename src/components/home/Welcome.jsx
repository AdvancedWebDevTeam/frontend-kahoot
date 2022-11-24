import "./Home.css";
import welcomeImage from "./welcome.png";

export default function Welcome() {
  return (
    <div className="box6" style={{ marginTop: "5%" }}>
      <div>
        <img
          style={{
            height: "350px",
            width: "350px",
            margin: "0px auto",
            display: "block"
          }}
          alt="welcome_img"
          src={welcomeImage}
        />
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>Welcome to our website</h1>
      </div>
    </div>
  );
}
