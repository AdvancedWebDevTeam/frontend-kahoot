import React from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react'
import { SocketContext } from '../socket/Socket';

import addNotification from 'react-push-notification';
import { useNavigate } from 'react-router';

export default function NotifyChat() {
    const [message, setMessage] = useState("");
    const [showNotify, setShowNotify] = useState(false);
    const [presentID, setPresentID] = useState("");
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("NotifyMessage", (data) => {
            setShowNotify(true);
            setPresentID(data.presents_id);
            setMessage(data.message);
          });
        return () => {
            socket.off("NotifyMessage");
        }
    },[socket])

    const notify = () => {
        addNotification({
            title: "Notify",
            message: message,
            duration: 4000,
            native: true,
            onClick: () => {
                navigate(`/${presentID}/chat`);
                setShowNotify(false);
            }
        });
        setShowNotify(false);
    }

  return (
    <div>
        {showNotify && notify()}
    </div>
  )
}
