import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import io from "socket.io-client";

interface MessageProps {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const messagesQeue: MessageProps[] = [];

const socket = io("http://localhost:4000");

socket.on("new_message", (newMessage: MessageProps) => {
  messagesQeue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<MessageProps[]>();

  useEffect(() => {
    setInterval(() => {
      if (messagesQeue.length > 0) {
        setMessages((prevState) =>
          [messagesQeue[0], prevState[0], prevState[1]].filter(Boolean)
        );

        messagesQeue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    api.get<MessageProps[]>("messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages?.map((message) => {
          return (
            <li className={styles.message} key={message.id}>
              <p>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img
                    src={message.user.avatar_url}
                    alt={message.user.name || "No Name"}
                  />
                </div>
                <span>{message.user.name || "No Name"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
