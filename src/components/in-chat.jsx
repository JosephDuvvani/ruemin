import { useContext } from "react";
import UserContext from "../context/user-context";

const InChat = () => {
  const { user, inbox } = useContext(UserContext);

  const inChat = inbox?.map((chat) =>
    chat.users.find((chatter) => chatter.id !== user.id)
  );

  return (
    <div className="chatters">
      {inChat &&
        (inChat.length > 0 ? (
          inChat.map((chatter) => (
            <div key={chatter.id} className="card">
              <div className="card__img">
                <img
                  src={chatter.profile.imageUrl || "/src/assets/profile.jpeg"}
                  alt=""
                />
              </div>
              <div className="card__title">
                {`${chatter.profile.firstname} ${chatter.profile.lastname}`.trim()}
              </div>
            </div>
          ))
        ) : (
          <div className="card card-empty">
            No one in chat. Go to suggestions
          </div>
        ))}
    </div>
  );
};

export default InChat;
