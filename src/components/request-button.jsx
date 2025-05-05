import { useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import { jwtDecode } from "jwt-decode";
import RequestContext from "../context/request-context";

const RequestButton = ({ receiverId, users, setUsers }) => {
  const { requests, setRequests } = useContext(RequestContext);

  const requestChat = async () => {
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
    <button className="request-btn" onClick={handleSend}>
      Add
    </button>
  );
};

export default RequestButton;
