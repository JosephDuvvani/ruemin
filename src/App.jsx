import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import isAuth from "./utils/guardAuth";
import { UserProvider } from "./context/user-context";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import fetchToken from "./utils/refresh-auth";
import "./assets/styles/global.css";

function App() {
  const [user, setUser] = useState();
  const [inbox, setInbox] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
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
        fetch(`${apiURL}/chats`, options)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) console.error(data.error.msg);
            else setInbox(data.chats.inbox);
          });
      }
    };

    if (!isAuth()) navigate("login", { replace: true });
    else {
      const cookies = new Cookies(null, { path: "/" });
      const refreshToken = cookies.get("jwt-refresh-ruemin");
      const decode = jwtDecode(refreshToken);
      setUser({ id: decode.id, username: decode.username });

      if (user) fetchChats();
    }
  }, [user?.id]);
  return (
    <UserProvider value={{ user, inbox, setUser, setInbox }}>
      <Outlet />
    </UserProvider>
  );
}

export default App;
