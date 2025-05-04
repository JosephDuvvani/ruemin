import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import isAuth from "./utils/guardAuth";
import { UserProvider } from "./context/user-context";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState();
  const [inbox, setInbox] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) navigate("login", { replace: true });
    else {
      const cookies = new Cookies(null, { path: "/" });
      const refreshToken = cookies.get("jwt-refresh-ruemin");
      const decode = jwtDecode(refreshToken);
      setUser({ id: decode.id, username: decode.username });
    }
  }, []);
  return (
    <UserProvider value={{ user, inbox, setUser, setInbox }}>
      <Outlet />
    </UserProvider>
  );
}

export default App;
