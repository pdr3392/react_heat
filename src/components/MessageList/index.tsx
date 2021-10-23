import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";

interface MessageProps {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

export function MessageList() {
  const [messages, setMessages] = useState<MessageProps[]>();

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
