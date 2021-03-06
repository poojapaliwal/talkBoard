import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { MoreVert, AttachFile, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import axios from "./axios";

function Chat({messages}) {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const {roomId} = useParams();
  const [roomName, setRoomName] = useState("");
  // const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();


  const sendMessage = async (e) =>{
    e.preventDefault();

    await axios.post('/message/new',{
      message: input,
      name : user.displayName,
      timestamp: "time",
      received : true,
    });

    setInput("");
  }

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      // db.collection("rooms")
      //   .doc(roomId)
      //   .collection("messages")
      //   .orderBy("timestamp", "asc")
      //   .onSnapshot((snapshot) => {
      //     setMessages(snapshot.docs.map((doc) => doc.data()));
      //   });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   db.collection("rooms").doc(roomId).collection("messages").add({
  //     message: input,
  //     name: user.displayName,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //   });
  //   setInput("");
  // };


  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3 className="chat-room-name">{roomName}</h3>
          {/* <p className="chat-room-last-seen">
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p> */}
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p className={`chat__message ${message.received && "chat__receiver"
            }`}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {/* {new Date(message.timestamp?.toDate()).toUTCString()} */}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form >
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  )
}

export default Chat;
