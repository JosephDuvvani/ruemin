import { Link, Outlet } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { RequestProvider } from "../context/request-context";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import fetchToken from "../utils/refresh-auth";

const Chatters = () => {
  const [requests, setRequests] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
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
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        fetch(`${apiURL}/requests`, options)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) console.error(data.error.msg);
            else setRequests(data.requests);
          });
      }
    };
    fetchRequests();
  }, []);
  return (
    <>
      <Header />
      <div>
        <div>
          <Link to={"./"}>In Chat</Link>
          <Link to={"suggestions"}>Suggestions</Link>
          <Link to={"requests"}>Requests</Link>
        </div>
        <RequestProvider value={{ requests, setRequests }}>
          <div>
            <Outlet />
          </div>
        </RequestProvider>
      </div>
    </>
  );
};

export default Chatters;
