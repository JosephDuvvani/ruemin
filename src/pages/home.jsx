import { useContext } from "react";
import Header from "../components/header";
import UserContext from "../context/user-context";
import { Link, Outlet } from "react-router-dom";
import { format } from "date-fns";

const Homepage = () => {
  const { user, inbox } = useContext(UserContext);

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
                      <Link to={`messages/${chat.id}`} className="chat__link">
                        <div className="chat__link__image">
                          <img
                            src={
                              chatter.profile.imageUrl ||
                              "/src/assets/profile.jpeg"
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
      <div className="message-block">
        <Outlet />
      </div>
    </>
  );
};

export default Homepage;
