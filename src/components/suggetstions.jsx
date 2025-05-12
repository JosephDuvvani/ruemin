import { useContext, useEffect, useState } from "react";
import UserContext from "../context/user-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import RequestButton from "./request-button";
import RequestContext from "../context/request-context";

const Suggestions = () => {
  const { user, inbox } = useContext(UserContext);
  const { requests } = useContext(RequestContext);
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
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
        fetch(`${apiURL}/users`, options)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) console.error(data.error.msg);
            else setUsers(data.users);
          });
      }
    };
    fetchUsers();
  }, []);

  const inChat =
    inbox &&
    [...inbox].map(
      (chat) => chat.users.find((chatter) => chatter.id !== user.id).id
    );

  const inRequests = requests && [
    ...requests.sent.map((req) => req.receiverId),
    ...requests.received.map((req) => req.senderId),
  ];

  const notInChat =
    users &&
    [...users].filter(
      (chatter) =>
        !inChat?.includes(chatter.id) && !inRequests?.includes(chatter.id)
    );

  return (
    <div className="chatters">
      {notInChat &&
        (notInChat.length > 0 ? (
          notInChat.map((chatter) => (
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
              <RequestButton
                receiverId={chatter.id}
                users={users}
                setUsers={setUsers}
              />
            </div>
          ))
        ) : (
          <div className="card card-empty">No suggestions</div>
        ))}
    </div>
  );
};

export default Suggestions;
