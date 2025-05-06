import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiHome, mdiAccountMultipleOutline, mdiChevronDown } from "@mdi/js";
import AccountDropdown from "./accountDropdown";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserContext from "../context/user-context";

const Header = () => {
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
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
        fetch(`${apiURL}/users/${user.id}/details`, options)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) console.error(data.error.msg);
            else setUserDetails(data.user);
          });
      }
    };

    if (user) fetchUserDetails();
  }, [user?.id]);
  return (
    <header className="header">
      <h1 className="header__title">RUEMIN</h1>
      <nav className="header__nav">
        <Link to={"/"} className="header__nav__link" aria-label="Homepage">
          <span>
            <Icon path={mdiHome} size={1} title="Home" />
          </span>
        </Link>
        <Link
          to={"/chatters"}
          className="header__nav__link"
          aria-label="Ruemin chatters"
        >
          <span>
            <Icon path={mdiAccountMultipleOutline} size={1} title="Chatters" />
          </span>
        </Link>
      </nav>
      <div>
        <button className="account-btn">
          <img
            className="account-btn__image"
            src={userDetails?.profile.imageUrl || "/src/assets/profile.jpeg"}
            alt=""
          />

          <Icon className="account-btn__image" path={mdiChevronDown} size={1} />
        </button>
      </div>
      <AccountDropdown user={userDetails} />
    </header>
  );
};

export default Header;
