import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getAllChat } from '../../fetch/presentationFetch';
import { SocketContext } from '../socket/Socket';
import "./Chat.css";

function getUserId() {
    const accessToken = localStorage.getItem("accessToken");
    return JSON.parse(atob(accessToken.split(".")[1])).user.users_id;
}

export default function Chat({ room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const socket = useContext(SocketContext);
    const userID = getUserId();
    const param = useParams();

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                author: userID,
                chat: currentMessage,
            };
            const data = {
                presents_id: param.presentId,
                users_id: userID,
                content: currentMessage
            }
            await socket.emit("send_message", data);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            const element = {
                author: data.users_id,
                chat: data.content
            }
            setMessageList((list) => [...list, element]);
        });
        return () => {
            socket.off("receive_message");
        }
    }, [socket]);

    useEffect(() => {
        getAllChat(param.presentId).then((data) => {
            setMessageList(data);
        }).catch((error) => console.log(error));
    }, [])

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Group Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={userID === messageContent.author ? "you" : "other"}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.chat}</p>
                                    </div>
                                    <div className="message-meta">
                                        {/* <p id="time">{messageContent.time}</p> */}
                                        <p id="author">{messageContent.author}</p>
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