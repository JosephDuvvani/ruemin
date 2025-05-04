import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../context/user-context";
import { format } from "date-fns";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import fetchToken from "../utils/refresh-auth";

const Chat = () => {
  const { chatId } = useParams();
  const { user, inbox, setInbox } = useContext(UserContext);
  const [text, setText] = useState();

  const chat = inbox?.find((chat) => chat.id === chatId);
  const receiver = chat?.users.find((chatter) => chatter.id !== user.id);

  const handleSend = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (text?.length === 0 || !text) return;
      const sendMessage = async () => {
        const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
        const cookies = new Cookies(null, { path: "/" });
        let accessToken = cookies.get("jwt-access-ruemin");
        if (!accessToken) {
          const refreshToken = cookies.get("jwt-refresh-ruemin");
          const url = `${apiURL}/token`;
          const data = await fetchToken(refreshToken, url);

          if (data.accessToken) {
            const decode = jwtDecode(data.accessToken);
            cookies.set("jwt-access-ruemin", data.accessToken, {
              expires: new Date(decode.exp * 1000),
            });
            accessToken = data.accessToken;
          }
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
            .finally(() => setText(""));
        }
      };
      sendMessage();
    }
  };

  return (
    <div className="messages">
      {receiver && (
        <div className="receiver">
          <div className="receiver__image">
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
        <div className="messages__list">
          {chat.messages.map((msg) => (
            <div className="message" key={msg.id}>
              <div className="message__date">
                {format(msg.sentAt, "yyyy/MM/dd HH:ss")}
              </div>
              <div className="message__content">{msg.content}</div>
            </div>
          ))}
        </div>
      )}
      <div className="messages__send">
        <textarea
          name="message"
          placeholder="Write message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleSend}
        ></textarea>
      </div>
    </div>
  );
};

export default Chat;
