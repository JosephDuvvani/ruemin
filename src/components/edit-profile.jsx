import Icon from "@mdi/react";
import { mdiAccount, mdiClose } from "@mdi/js";
import { useContext, useState } from "react";
import EditNameForm from "./edit-name-form";
import UserContext from "../context/user-context";
import EditBioForm from "./edit-bio-form";

const EditProfile = ({ setEditProfile }) => {
  const [editContent, setEditContent] = useState(false);
  const { user } = useContext(UserContext);

  const profile = user?.profile;

  return (
    <div className="overlay">
      <div className="profile-edit">
        <div className="profile-edit__title">Edit Profile</div>
        <div className="profile-edit__block">
          <div className="profile-edit__header">
            <h3 className="profile-edit__heading">Profile Picture</h3>
            <button>Edit</button>
          </div>
          <div className="profile-edit__picture">
            <img src={profile.imageUrl || "/src/assets/profile.jpeg"} alt="" />
          </div>
        </div>

        <div className="profile-edit__block">
          <div className="profile-edit__header">
            <h3 className="profile-edit__heading">Name</h3>
            {editContent !== "name" && (
              <button onClick={() => setEditContent("name")}>Edit</button>
            )}
          </div>
          <div className="profile-edit__name">
            <span>
              <Icon path={mdiAccount} size={1} />
            </span>
            {`${profile.firstname} ${profile.lastname}`.trim()}
          </div>
          {editContent === "name" && (
            <EditNameForm setEditContent={setEditContent} />
          )}
        </div>

        <div className="profile-edit__block">
          <div className="profile-edit__header">
            <h3 className="profile-edit__heading">Bio</h3>
            {editContent !== "bio" && (
              <button onClick={() => setEditContent("bio")}>Edit</button>
            )}
          </div>
          <div className="profile-edit__bio">
            {profile.bio && profile.bio !== ""
              ? profile.bio
              : "Describe yourself..."}
          </div>
          {editContent === "bio" && (
            <EditBioForm setEditContent={setEditContent} />
          )}
        </div>
      </div>
      <button className="close-overlay" onClick={() => setEditProfile(false)}>
        <span>
          <Icon path={mdiClose} size={1} />
        </span>
      </button>
    </div>
  );
};

export default EditProfile;
