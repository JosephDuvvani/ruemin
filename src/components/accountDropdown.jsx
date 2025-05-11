import Icon from "@mdi/react";
import { mdiAccountEditOutline } from "@mdi/js";
import LogoutButton from "./logout";

const AccountDropdown = ({ user, setEditProfile }) => {
  return (
    <div className="header__dropdown account__dropdown" data-dropdown="account">
      <div className="account__user">
        <div>
          <img
            className="account__user__img"
            src={user?.profile.imageUrl || "/src/assets/profile.jpeg"}
            alt=""
          />
        </div>
        <span className="account__user__title">
          {`${user?.profile.firstname} ${user?.profile.lastname}`.trim()}
        </span>
        <div>
          <button className="edit-btn" onClick={() => setEditProfile(true)}>
            <span>
              <Icon
                path={mdiAccountEditOutline}
                size={1}
                className="edit-btn__icon"
              />
            </span>
          </button>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};

export default AccountDropdown;
