import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import "./Home.css";

export default function Home(props) {
  const buttonSignOut_Clicked = () => {
    const newUser = {
      users_id: "",
      users_name: "",
      email: ""
    };
    localStorage.removeItem("user");
    props.onHandleChange(newUser);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img alt="home" src="home-button.png" style={{ height: "50px" }} />
          </Link>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Navbar.Brand>
            <Link className="textstyle" to="/">
              Home
            </Link>
          </Navbar.Brand>
          <Navbar.Brand>
            <Link className="textstyle" to="/">
              Product
            </Link>
          </Navbar.Brand>
          <Navbar.Brand>
            <Link className="textstyle" to="/">
              Cart
            </Link>
          </Navbar.Brand>
          {props.user.userID !== "" && (
            <Navbar.Brand>
              <Link className="textstyle" to="/">
                Account
              </Link>
            </Navbar.Brand>
          )}
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {props.user.userID !== "" ? (
            <div>
              <div className="allign1">
                <Navbar.Brand>
                  <Link to="/">
                    <img alt="user" src="user.png" style={{ height: "30px" }} />
                  </Link>
                </Navbar.Brand>
              </div>
              <div className="allign1" onClick={buttonSignOut_Clicked}>
                <Navbar.Text>
                  <div className="textstyle box1" to="/myaccount">
                    Sign Out
                  </div>
                </Navbar.Text>
              </div>
            </div>
          ) : (
            <div>
              <Navbar.Text>
                <Link className="textstyle box1" to="/login">
                  Sign In
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link className="textstyle box1" to="/register">
                  Sign Up
                </Link>
              </Navbar.Text>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
