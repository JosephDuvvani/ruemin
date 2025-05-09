import { useContext } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import RequestContext from "../context/request-context";

const RequestButton = ({ receiverId, users, setUsers }) => {
  const { requests, setRequests } = useContext(RequestContext);

  const requestChat = async () => {
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
        body: JSON.stringify({
          receiverId,
        }),
      };
      fetch(`${apiURL}/requests`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) console.error(data.error.msg);
          else if (data.request) {
            const receiver = users.find((chatter) => chatter.id === receiverId);
            setUsers(users.filter((chatter) => chatter.id !== receiverId));
            setRequests({
              ...requests,
              sent: [...requests.sent, { ...data.request, receiver }],
            });
          }
        });
    }
  };
  const handleSend = () => requestChat();

  return (
    <button className="card__btn" onClick={handleSend}>
      Add
    </button>
  );
};

export default RequestButton;
