import LogoutButton from "./logout";

const AccountDropdown = ({ user }) => {
  return (
    <div>
      <div>
        <div>
          <span>
            <img
              src={user?.profile.imageUrl || "/src/assets/profile.jpeg"}
              alt=""
            />
          </span>
          <span>
            {`${user?.profile.firstname} ${user?.profile.lastname}`.trim()}
          </span>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};

export default AccountDropdown;
