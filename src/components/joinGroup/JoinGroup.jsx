import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

export default function JoinGroup() {
    const navigate = useNavigate();

    const handle = async() => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            navigate("/login");
        }
        else {
            alert("JoinGroup success!");
            navigate("/");
            await axios.get(`${process.env.REACT_APP_API_URL}/roles/*/${parseJwt(token).user.users_id}`)
            .then((response) => {

            }).catch((error) => console.error());
        }
    };

    useEffect(() => {
        handle();
      }, []);
  return (
    <div>JoinGroup</div>
  )
}
