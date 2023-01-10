import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./generalComponent.css";
import { Button } from "react-bootstrap";
import { BsFillPersonLinesFill, BsBoxArrowRight } from "react-icons/bs";
import TooltipTrigger from "./TooltipTrigger";

function getActiveKey(pathname) {
  const presentLinks = ["/presentations", "/slide"];
  return presentLinks.includes(pathname) ? "presentations" : pathname;
}

export default function AppNavBar({ user, buttonSignOutClicked }) {
  const location = useLocation();

  const extraNavElements = user.users_id !== "" && (
    <>
      <Nav.Link href="/group">Group</Nav.Link>
      <Nav.Link href={`/presentations/mypresent/${user.users_id}`}>
        Presentations
      </Nav.Link>
    </>
  );
  const authElements =
    user.users_id !== "" ? (
      <>
        <Nav.Link href="/profile">
          <TooltipTrigger text={user.users_name}>
            <Button variant="outline-primary">
              <BsFillPersonLinesFill size="1.2em" />
            </Button>
          </TooltipTrigger>
        </Nav.Link>
        <Nav.Link>
          <TooltipTrigger text="Sign out">
            <Button variant="outline-danger" onClick={buttonSignOutClicked}>
              <BsBoxArrowRight />
            </Button>
          </TooltipTrigger>
        </Nav.Link>
      </>
    ) : (
      <>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/register">Sign up</Nav.Link>
      </>
    );
  const activeKey = getActiveKey(location.pathname);

  return (
    <Navbar collapseOnSelect expand="md" bg="light" variant="light" className="app-nav">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="present&study logo"
            src="/logo.png"
            style={{ height: "50px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" activeKey={activeKey}>
            <Nav.Link href="/">Home</Nav.Link>
            {extraNavElements}
          </Nav>
          <Nav>{authElements}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
