import { useContext, useState } from "react";
import RequestContext from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import UserContext from "../context/user-context";
import LoadingSpinner from "./loading-spinner";

const AcceptRequest = ({ requestId }) => {
  const [loading, setLoading] = useState(false);
  const { inbox, setInbox } = useContext(UserContext);
  const { requests, setRequests } = useContext(RequestContext);

  const acceptRequest = async () => {
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
        },
      };
      setLoading(true);
      fetch(`${apiURL}/requests/${requestId}/accept`, options)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.chat) {
            setRequests({
              ...requests,
              received: [...requests.received].filter(
                (req) => req.id !== requestId
              ),
            });
            setInbox([data.chat, ...inbox]);
          }
        });
    }
  };

  return (
    <button
      onClick={acceptRequest}
      className="card__btn accept-btn"
      disabled={loading}
    >
      {!loading ? (
        "Accept"
      ) : (
        <div className="loading">
          <LoadingSpinner size={0.85} />
        </div>
      )}
    </button>
  );
};

export default AcceptRequest;
