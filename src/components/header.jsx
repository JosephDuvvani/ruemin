import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiHome, mdiAccountMultipleOutline, mdiChevronDown } from "@mdi/js";
import AccountDropdown from "./accountDropdown";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserContext from "../context/user-context";
import fetchToken from "../utils/refresh-auth";
import "../assets/styles/header.css";

const Header = () => {
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState();
  const [dropdown, setDropdown] = useState(false);

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

    const handleBodyClick = (e) => {
      if (!dropdown || e.target.dataset.type === "account-button") return;
      else if (!e.target.dataset.dropdown) setDropdown(!dropdown);
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [user?.id, dropdown]);

  const toggleDropdown = () => setDropdown(!dropdown);

  return (
    <header className="header">
      <h1 className="header__title">RUEMIN</h1>
      <nav className="header__nav">
        <Link to={"/"} className="header__nav__link" aria-label="Homepage">
          <span>
            <Icon className="header__nav__icon" path={mdiHome} title="Home" />
          </span>
        </Link>
        <Link
          to={"/chatters"}
          className="header__nav__link"
          aria-label="Ruemin chatters"
        >
          <span>
            <Icon
              className="header__nav__icon"
              path={mdiAccountMultipleOutline}
              title="Chatters"
            />
          </span>
        </Link>
      </nav>
      <div className="account">
        <button
          className="account__btn"
          title="Account"
          onClick={toggleDropdown}
          data-type="account-button"
        >
          <img
            className="account__btn__img"
            src={userDetails?.profile.imageUrl || "/src/assets/profile.jpeg"}
            alt=""
          />

          <span className="account__btn__icon">
            <Icon path={mdiChevronDown} size={0.65} />
          </span>
        </button>

        {dropdown && <AccountDropdown user={userDetails} />}
      </div>
    </header>
  );
};

export default Header;
