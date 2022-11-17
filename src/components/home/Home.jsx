import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import "./Home.css";

export default function Home() {


  const [user, setUser] = useState({
    users_id: "",
    users_name: "",
    email: ""
  })

  const buttonSignOut_Clicked = () => {
    const newUser = {
      users_id: "",
      users_name: "",
      email: ""
    };
    setUser(newUser);
    localStorage.removeItem("accessToken");
  };



  // const { isLoading, isFetching, error, data, status } = useQuery(["user"], async () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token !== null) {
  //     const axiosIntance = axios.create({
  //       baseURL: `${process.env.REACT_APP_API_URL}`,
  //       headers: {
  //         'Authorization': `Bearer ${JSON.parse(token)}`
  //       }
  //     });

  //     await axiosIntance.get(`/auth/profile`)
  //       .then((res) => {
  //         console.log(res);
  //         setUser(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // });

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    if (token !== null) {
      const axiosIntance = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`,
        headers: {
          'Authorization': `Bearer ${JSON.parse(token)}`
        }
      });

      await axiosIntance.get(`/auth/profile`)
        .then((res) => {
          console.log(res);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

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
          {user.users_id !== "" && (
            <Navbar.Brand>
              <Link className="textstyle" to="/">
                Account
              </Link>
            </Navbar.Brand>
          )}
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user.users_id !== "" ? (
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
