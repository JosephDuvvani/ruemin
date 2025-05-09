import { useContext } from "react";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";
import Cookies from "universal-cookie";
import UserContext from "../context/user-context";

const LogoutButton = () => {
  const { setUser, setInbox } = useContext(UserContext);
  const cookies = new Cookies(null, { path: "/" });

  const handleClick = () => {
    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const token = cookies.get("jwt-refresh-ruemin");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    };

    fetch(`${apiURL}/logout`, options).then((res) => {
      if (res.status === 204) {
        cookies.remove("jwt-access-ruemin");
        cookies.remove("jwt-refresh-ruemin");
        setUser(null);
        setInbox(null);
      }
    });
  };

  return (
    <button className="logout-btn" onClick={handleClick}>
      <span>
        <Icon className="logout-btn__icon" path={mdiLogout} size={1} />
      </span>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
