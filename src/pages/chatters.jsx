import { Link, Outlet } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { RequestProvider } from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";

const Chatters = () => {
  const [requests, setRequests] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
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
