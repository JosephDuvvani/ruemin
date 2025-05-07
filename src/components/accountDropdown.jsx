import LogoutButton from "./logout";

const AccountDropdown = ({ user }) => {
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
        <span>
          {`${user?.profile.firstname} ${user?.profile.lastname}`.trim()}
        </span>
      </div>
      <LogoutButton />
    </div>
  );
};

export default AccountDropdown;
