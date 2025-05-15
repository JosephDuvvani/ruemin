import { useContext, useState } from "react";
import RequestContext from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import LoadingSpinner from "./loading-spinner";

const RejectRequest = ({ requestId }) => {
  const [loading, setLoading] = useState(false);
  const { requests, setRequests } = useContext(RequestContext);

  const rejectRequest = async () => {
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
            received: [...requests.received].filter(
              (req) => req.id !== requestId
            ),
          });
        }
      });
    }
  };

  return (
    <button
      onClick={rejectRequest}
      className="card__btn card__btn--reject"
      disabled={loading}
    >
      {!loading ? (
        "Reject"
      ) : (
        <div className="loading">
          <LoadingSpinner size={0.85} />
        </div>
      )}
    </button>
  );
};

export default RejectRequest;
