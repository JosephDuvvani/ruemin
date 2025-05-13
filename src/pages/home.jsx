import { createContext, useContext, useState } from "react";
import Header from "../components/header";
import UserContext from "../context/user-context";
import { Link, Outlet } from "react-router-dom";
import { format } from "date-fns";

const IsActiveContext = createContext();

const Homepage = () => {
  const [active, setActive] = useState(null);
  const { user, inbox } = useContext(UserContext);

  return (
    <>
      <div className="banner">
        <Header />
        <div className="navbar">
          <div className="navbar__link inbox">Inbox</div>
        </div>
      </div>
      <div className={active ? "chats-grid active" : "chats-grid"}>
        <div aria-label="Chats" className="chats">
          <div className="chats__header">
            <div className="chats__title">Your Inbox</div>
          </div>
          <div className="chats__nav">
            {inbox && inbox.length > 0 ? (
              inbox.map((chat, index) =>
                chat.users.map(
                  (chatter) =>
                    chatter.id !== user.id && (
                      <div key={index} className="chat">
                        <Link
                          to={`messages/${chat.id}`}
                          className={
                            active === chat.id
                              ? "chat__link active"
                              : "chat__link"
                          }
                          onClick={() => setActive(chat.id)}
                        >
                          <div className="chat__link__img">
                            <img
                              src={
                                chatter.profile.imageUrl ||
                                "/src/assets/profile.jpeg"
                              }
                              alt=""
                            />
                          </div>
                          <div>
                            <span className="chat__link__title">
                              {`${chatter.profile.firstname} ${chatter.profile.lastname}`.trim()}
                            </span>

                            <div className="chat__link__caption">
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
                                {format(chat.updatedAt, "dd/MM/yyyy")}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                )
              )
            ) : (
              <div className="chat-empty">No active chats</div>
            )}
          </div>
        </div>
        <IsActiveContext.Provider value={{ setActive }}>
          <div className="message-block">
            <Outlet />
          </div>
        </IsActiveContext.Provider>
      </div>
    </>
  );
};

export default Homepage;
export { IsActiveContext };
