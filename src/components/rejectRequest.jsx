import { useContext } from "react";
import RequestContext from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";

const RejectRequest = ({ requestId }) => {
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
      fetch(`${apiURL}/requests/${requestId}/reject`, options).then((res) => {
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
    <button onClick={rejectRequest} className="card__btn card__btn--reject">
      Reject
    </button>
  );
};

export default RejectRequest;
