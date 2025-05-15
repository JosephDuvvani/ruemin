import { useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";
import Cookies from "universal-cookie";
import UserContext from "../context/user-context";
import LoadingSpinner from "./loading-spinner";

const LogoutButton = () => {
  const [logging, setLogging] = useState(false);
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
    setLogging(true);
    fetch(`${apiURL}/logout`, options).then((res) => {
      setLogging(false);
      if (res.status === 204) {
        cookies.remove("jwt-access-ruemin");
        cookies.remove("jwt-refresh-ruemin");
        setUser(null);
        setInbox(null);
      }
    });
  };

  return (
    <button
      className="header__dropdown__btn account__dropdown__btn"
      onClick={handleClick}
      disabled={logging}
    >
      <div className="circle-bg-icon">
        <Icon path={mdiLogout} />
      </div>
      <span className="header__dropdown__btn__text">Logout</span>

      {logging && <LoadingSpinner size={0.85} />}
    </button>
  );
};

export default LogoutButton;
