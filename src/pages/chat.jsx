import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../context/user-context";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";

const Chat = () => {
  const { chatId } = useParams();
  const { user, inbox, setInbox } = useContext(UserContext);
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState(true);

  const chat = inbox?.find((chat) => chat.id === chatId);
  const receiver = chat?.users.find((chatter) => chatter.id !== user.id);

  const inputRef = useRef();

  useEffect(() => {
    if (text.length > 0 && placeholder) setPlaceholder(false);
    if (text.length === 0 && !placeholder) setPlaceholder(true);
  }, [text]);

  const handleSend = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (text.trim().length === 0 || !text) {
        inputRef.current.textContent = "";
        setText("");
        return;
      }
      const sendMessage = async () => {
        const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
        const cookies = new Cookies(null, { path: "/" });
        let accessToken = cookies.get("jwt-access-ruemin");
        if (!accessToken) {
          accessToken = await fetchToken();
        }

        if (accessToken) {
          const options = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text }),
          };
          fetch(`${apiURL}/chats/${chatId}`, options)
            .then((res) => res.json())
            .then((data) => {
              if (data.error) console.error(data.error.msg);
              else if (data.newMessage) {
                const chats = inbox.map((value) => {
                  if (value.id === chatId)
                    return {
                      ...chat,
                      messages: [...chat.messages, data.newMessage],
                    };
                  else return value;
                });
                setInbox(chats);
              }
            })
            .finally(() => {
              inputRef.current.textContent = "";
              setText("");
            });
        }
      };
      sendMessage();
    }
  };
  return (
    <>
      {receiver && (
        <div className="message-block__header">
          <div className="message-block__header__img">
            <img
              src={receiver.profile.imageUrl || "/src/assets/profile.jpeg"}
              alt=""
            />
          </div>

          <span className="chat__link__title message-block__header__title">
            {`${receiver.profile.firstname} ${receiver.profile.lastname}`.trim()}
          </span>
        </div>
      )}
      <div className="message-block__messages">
        {receiver && user && (
          <div className="receiver">
            <div className="receiver__img">
              <img
                src={receiver.profile.imageUrl || "/src/assets/profile.jpeg"}
                alt=""
              />
            </div>
            <span className="receiver__name">
              {`${receiver.profile.firstname} ${receiver.profile.lastname}`.trim()}
            </span>
          </div>
        )}
        {chat && chat.messages.length > 0 && (
          <div>
            <div className="message-block__messages__list">
              {chat.messages.map((msg) => (
                <div
                  className={
                    msg.senderId === user?.id ? "message sent" : "message"
                  }
                  key={msg.id}
                >
                  <div className="message__name">
                    {msg.senderId === user?.id
                      ? ""
                      : receiver.profile.firstname}
                  </div>
                  <div className="message__content">
                    <span>{msg.content}</span>
                    <div className="message__date">
                      {format(msg.sentAt, "dd/MM/yyyy, HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="message-block__footer">
        <div className="message-area">
          <div
            ref={inputRef}
            aria-label="Write a message"
            contentEditable
            className="message-input"
            onInput={(e) => setText(e.target.textContent)}
            onKeyDown={handleSend}
          ></div>
          {placeholder && (
            <div aria-hidden className="message-placeholder">
              Send a message
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
