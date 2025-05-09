import { Link, Outlet } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { RequestProvider } from "../context/request-context";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import "../assets/styles/chatters.css";

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
      <div className="navbar">
        <Link to={"./"} className="navbar__link">
          In Chat
        </Link>
        <Link to={"suggestions"} className="navbar__link">
          Suggestions
        </Link>
        <Link to={"requests"} className="navbar__link">
          Requests
        </Link>
      </div>
      <RequestProvider value={{ requests, setRequests }}>
        <div>
          <Outlet />
        </div>
      </RequestProvider>
    </>
  );
};

export default Chatters;
