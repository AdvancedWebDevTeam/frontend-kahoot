import React, { useContext, useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { getAllChat } from "../../fetch/presentationFetch";
import { getNameAndCreator } from "../../fetch/slideFetch";
import { getLoggedInUserId, getLoggedInUsername } from "../../util/ultilis";
import { SocketContext } from "../socket/Socket";
import "./Chat.css";

export default function Chat() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [presentInfo, setPresentInfo] = useState([]);
  const socket = useContext(SocketContext);
  const userID = getLoggedInUserId();
  const param = useParams();
  const username = getLoggedInUsername();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const data = {
        presents_id: param.presentId,
        users_id: userID,
        content: currentMessage,
        name: username
      };
      await socket.emit("send_message", { presentInfo, data, userID });
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const element = {
        author: data.users_id,
        chat: data.content,
        name: data.name
      };
      setMessageList((list) => [...list, element]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    getAllChat(param.presentId)
      .then((data) => {
        setMessageList(data);
      })
      .catch((error) => console.log(error));
    getNameAndCreator(param.presentId)
      .then((data) => {
        setPresentInfo(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Group Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={userID === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.chat}</p>
                  </div>
                  <div className="message-meta">
                    <p id="author">{messageContent.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Input..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
