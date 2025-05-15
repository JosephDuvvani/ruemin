import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import RequestContext from "../context/request-context";
import LoadingSpinner from "./loading-spinner";

const RequestButton = ({ receiverId, users, setUsers }) => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      fetch(`${apiURL}/requests`, options)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
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
    <button className="card__btn" onClick={handleSend} disabled={loading}>
      {!loading ? (
        "Add"
      ) : (
        <div className="loading">
          <LoadingSpinner size={0.85} />
        </div>
      )}
    </button>
  );
};

export default RequestButton;
