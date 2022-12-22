import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import Welcome from "./Welcome";
import Group from "../group/Group";
import "./Home.css";
import UserProfile from "../profile/UserProfile";
import JoinGroupByLink from "../group/joinGroup/JoinGroupByLink";
import Presentation from "../presentation/Presentation";
import Slide from "../slide/Slide";

import homeImage from "./home-button.png";
import MemberView from "../slide/MemberView";
import { SocketContext } from "../socket/Socket";

export default function Home() {

  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");

  const [user, setUser] = useState({
    users_id: "",
    users_name: "",
    email: ""
  });
  const navigate = useNavigate();
  
  const buttonSignOut_Clicked = () => {
    const newUser = {
      users_id: "",
      users_name: "",
      email: ""
    };
    setUser(newUser);
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    if (token !== null) {
      const axiosIntance = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      });

      await axiosIntance
        .get(`/auth/profile`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchData();
    // socket.on("NotifyPresentation", (data) => {
    //   setMessage(data);
    // })

    // return () => {
    //   socket.off("NotifyPresentation");
    // }
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img alt="home" src={homeImage} style={{ height: "50px" }} />
            </Link>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Navbar.Brand>
              <Link className="textstyle" to="/">
                Home
              </Link>
            </Navbar.Brand>
            {user.users_id !== "" && (
              <Navbar.Brand>
                <Link className="textstyle" to="/group">
                  My group
                </Link>
              </Navbar.Brand>
            )}
            {user.users_id !== "" && (
              <Navbar.Brand>
                <Link className="textstyle" to="/profile">
                  My profile
                </Link>
              </Navbar.Brand>
            )}
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user.users_id !== "" ? (
              <div>
                <div className="allign1" onClick={buttonSignOut_Clicked}>
                  <Navbar.Text>
                    <div className="textstyle box1">{user.users_name}</div>
                  </Navbar.Text>
                </div>
                <div className="allign1" onClick={buttonSignOut_Clicked}>
                  <Navbar.Text>
                    <div className="textstyle box1">Sign Out</div>
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
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="group/*" element={<Group userId={user.users_id} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="invite/*" element={<JoinGroupByLink />} />
        <Route path="presentations/:groupId" element={<Presentation />} />
        <Route path="slides/:groupId/show/:presentId" element={<Slide/>} />
        <Route path="share/slide/:slideId" element={<MemberView/>} />
      </Routes>

      {/* {message !== "" &&
          <Alert variant="danger" onClose={() => setMessage("")} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <div>Notify</div>
            </Alert>
      } */}
    </div>
  );
}
