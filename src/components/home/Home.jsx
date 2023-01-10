import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Welcome from "./Welcome";
import Group from "../group/Group";
import "./Home.css";
import UserProfile from "../profile/UserProfile";
import JoinGroupByLink from "../group/joinGroup/JoinGroupByLink";
import Presentation from "../presentation/Presentation";
import Slide from "../slide/Slide";
import MyPresentation from "../presentation/MyPresentation";
import MemberView from "../slide/MemberView";

import { JoinRoomSocket } from "./JoinRoomSocket";
import Chat from "../chat/Chat";
import NotifyChat from "./NotifyChat";
import AppNavBar from "../general/AppNavbar";
import { useContext } from "react";
import { SocketContext } from "../socket/Socket";
import { getLoggedInUserId } from "../../util/ultilis";

export default function Home() {
  const [user, setUser] = useState({
    users_id: "",
    users_name: "",
    email: ""
  });
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const buttonSignOutClicked = () => {
    const newUser = {
      users_id: "",
      users_name: "",
      email: ""
    };
    setUser(newUser);
    localStorage.removeItem("accessToken");
    socket.emit("LogOut", getLoggedInUserId());
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

      await axiosIntance.get(`/auth/profile`).then((res) => {
        setUser(res.data);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <AppNavBar user={user} buttonSignOutClicked={buttonSignOutClicked} />
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="group/*" element={<Group userId={user.users_id} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="invite/:groupId" element={<JoinGroupByLink />} />
        <Route path="presentations/:groupId" element={<Presentation />} />
        <Route path="slides/:groupId/show/:presentId" element={<Slide />} />
        <Route path="/:presentId/chat" element={<Chat />} />
        <Route
          path="share/:access/slide/:groupId/:presentId"
          element={<MemberView />}
        />
        <Route
          path="presentations/mypresent/:userId"
          element={<MyPresentation />}
        />
      </Routes>
      {user.users_id !== "" && <JoinRoomSocket user={user} />}
      {user.users_id !== "" && <NotifyChat />}
    </div>
  );
}
