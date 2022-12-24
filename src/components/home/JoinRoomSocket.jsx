import { useEffect, useState, useContext  } from "react";
import { getGroupsOfUser } from "../../fetch/groupFetch";
import { socket } from "../socket/Socket";
import { Alert } from "react-bootstrap";
import { SocketContext } from "../socket/Socket";

export function JoinRoomSocket({user}) {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        socket.emit("Join", user.users_id);
        socket.on("NotifyPresentation", (data) => {
            setMessage(data);
        })
      
        return () => {
            socket.off("NotifyPresentation");
        }
    })
    
    return(
        <div>
            {message !== "" &&
                <Alert variant="success" onClose={() => setMessage("")} dismissible>
                    <Alert.Heading>{message}</Alert.Heading>
                    <div>Notify</div>
                </Alert>
            }
        </div>
    );
}