import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function JoinGroupByLink() {
  const navigate = useNavigate();

  const handle = async () => {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      navigate("/login");
    } else {
      await axios
        .put(
          `${process.env.REACT_APP_API_URL}/roles${window.location.pathname}/${
            parseJwt(token).user.users_id
          }`
        )
        .then((response) => {
          if (response.data.alreadyJoined) {
            alert("You were in the group!");
          } else {
            alert("JoinGroup success!");
          }
          navigate("/group");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    handle();
  }, []);
  return <div />;
}
