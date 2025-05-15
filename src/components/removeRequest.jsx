import { useContext, useState } from "react";
import RequestContext from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import LoadingSpinner from "./loading-spinner";

const RemoveRequest = ({ requestId }) => {
  const [loading, setLoading] = useState(false);
  const { requests, setRequests } = useContext(RequestContext);

  const removeRequest = async () => {
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
      fetch(`${apiURL}/requests/${requestId}/reject`, options).then((res) => {
        setLoading(false);
        if (res.status === 204) {
          setRequests({
            ...requests,
            sent: [...requests.sent].filter((req) => req.id !== requestId),
          });
        }
      });
    }
  };

  return (
    <button
      onClick={removeRequest}
      className="card__btn remove-btn"
      disabled={loading}
    >
      {!loading ? (
        "Remove"
      ) : (
        <div className="loading">
          <LoadingSpinner size={0.85} />
        </div>
      )}
    </button>
  );
};

export default RemoveRequest;
