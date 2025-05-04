import { useContext, useEffect } from "react";
import Header from "../components/header";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import UserContext from "../context/user-context";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

const Homepage = () => {
  const { user, inbox, setInbox } = useContext(UserContext);

  useEffect(() => {
    if (inbox) return;

    const fetchChats = async () => {
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
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        fetch(`${apiURL}/chats`, options)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) console.error(data.error.msg);
            else setInbox(data.chats.inbox);
          });
      }
    };
    fetchChats();
  }, []);

  return (
    <>
      <Header />
      <div>Inbox</div>
      <div aria-label="Chats" role="grid">
        {inbox &&
          (inbox.length > 0 ? (
            inbox.map((chat, index) =>
              chat.users.map(
                (chatter) =>
                  chatter.id !== user.id && (
                    <div key={index} className="chat">
                      <Link to={`##`} className="chat__link">
                        <div className="chat__link__image">
                          <img
                            src={
                              chatter.profile.imageUrl ||
                              "src/assets/profile.jpeg"
                            }
                            alt=""
                          />
                        </div>
                        <span className="chat__link__title">
                          {`${chatter.profile.firstname} ${chatter.profile.lastname}`.trim()}
                        </span>
                        <span className="chat__link__last-msg">
                          {chat.messages.length > 0
                            ? chat.messages[chat.messages.length - 1]
                                .senderId === user.id
                              ? `You: ${
                                  chat.messages[chat.messages.length - 1]
                                    .content
                                }`
                              : `${chatter.profile.firstname}: ${
                                  chat.messages[chat.messages.length - 1]
                                    .content
                                }`
                            : "Send your first message"}
                        </span>
                        <span className="chat__link__date">
                          {format(chat.updatedAt, "yyyy/MM/dd")}
                        </span>
                      </Link>
                    </div>
                  )
              )
            )
          ) : (
            <p>No chats active</p>
          ))}
      </div>
    </>
  );
};

export default Homepage;
