import { useContext } from "react";
import RequestContext from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import { jwtDecode } from "jwt-decode";

const RejectRequest = ({ requestId }) => {
  const { requests, setRequests } = useContext(RequestContext);

  const rejectRequest = async () => {
    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const cookies = new Cookies(null, { path: "/" });
    let accessToken = cookies.get("jwt-access-ruemin");
    if (!accessToken) {
      const refreshToken = cookies.get("jwt-refresh-ruemin");
      const url = `${apiURL}/token`;
      const data = await fetchToken(refreshToken, url);

      if (data.accessToken) {
        const decode = jwtDecode(data.accessToken);
        cookies.set("jwt-access-ruemin", data.accessToken, {
          expires: new Date(decode.exp * 1000),
        });
        accessToken = data.accessToken;
      }
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

  return <button onClick={rejectRequest}>Reject</button>;
};

export default RejectRequest;
