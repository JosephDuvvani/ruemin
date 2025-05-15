import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiArrowLeftThick,
  mdiLoading,
  mdiRefresh,
  mdiSend,
  mdiSendLock,
} from "@mdi/js";
import UserContext from "../context/user-context";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import { IsActiveContext } from "./home";

const Chat = () => {
  const { chatId } = useParams();
  const { user, inbox, setInbox } = useContext(UserContext);
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { setActive } = useContext(IsActiveContext);

  const chat = inbox?.find((chat) => chat.id === chatId);
  const receiver = chat?.users.find((chatter) => chatter.id !== user.id);

  const inputRef = useRef();
  const sendingRef = useRef();

  useEffect(() => {
    if (text.length > 0 && placeholder) setPlaceholder(false);
    if (text.length === 0 && !placeholder) setPlaceholder(true);
  }, [text]);

  useEffect(() => {
    sendingRef.current?.focus();
  }, [chatId, chat?.messages.length]);

  const refreshChat = async () => {
    setRefreshing(true);
    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const cookies = new Cookies(null, { path: "/" });
    let accessToken = cookies.get("jwt-access-ruemin");
    if (!accessToken) {
      accessToken = await fetchToken();
    }

    if (accessToken) {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      fetch(`${apiURL}/chats/${chatId}`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) console.error(data.error.msg);
          else
            setInbox(
              inbox.map((chat) => (chat.id === chatId ? data.chat : chat))
            );
        })
        .finally(() => setRefreshing(false));
    }
  };

  const handleSend = (e) => {
    if (e.key === "Enter" || e.target.dataset.send) {
      e.preventDefault();
      if (refreshing) return;
      if (text.trim().length === 0 || !text) {
        inputRef.current.textContent = "";
        setText("");
        return;
      }
      setSending(true);
      sendingRef.current.focus();
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
              setSending(false);
              setText("");
            });
        }
      };
      sendMessage();
    }
  };
  const handleBack = () => {
    setActive(null);
    navigate("/");
  };
  return (
    <>
      {receiver && (
        <div className="message-block__header">
          <button className="back-btn" onClick={handleBack}>
            <Icon path={mdiArrowLeftThick} size={1} />
          </button>
          <div className="message-block__header__img">
            <img
              src={receiver.profile.imageUrl || "/src/assets/profile.jpeg"}
              alt=""
            />
          </div>

          <span className="chat__link__title message-block__header__title">
            {`${receiver.profile.firstname} ${receiver.profile.lastname}`.trim()}
          </span>
          {!refreshing && (
            <button
              className="refresh-chat back-btn"
              title="Refresh chat"
              onClick={refreshChat}
            >
              <Icon path={mdiRefresh} size={1} />
            </button>
          )}
          {refreshing && (
            <div className="loading--chat">
              <div className="loading__icon">
                <Icon path={mdiLoading} size={1} />
              </div>
            </div>
          )}
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

              <div
                ref={sendingRef}
                className="loading"
                aria-hidden
                tabIndex={-1}
              >
                {sending && (
                  <div className="loading__icon">
                    <Icon path={mdiLoading} size={1} />
                  </div>
                )}
              </div>
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
          <button
            className="send-btn back-btn"
            title={
              refreshing
                ? "Still refreshing chat"
                : text.trim() == ""
                ? "Write a message"
                : "Press Enter to send"
            }
            onClick={handleSend}
            data-send={true}
            disabled={refreshing || text.trim() == ""}
          >
            <Icon
              path={refreshing || text.trim() == "" ? mdiSendLock : mdiSend}
              size={1}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
