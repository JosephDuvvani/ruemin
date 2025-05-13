import Icon from "@mdi/react";
import { mdiClose, mdiPlus, mdiLoading } from "@mdi/js";
import { useContext, useRef, useState } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import UserContext from "../context/user-context";

const EditPicture = ({ setEditContent }) => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const inputRef = useRef();

  const handleUpload = async () => {
    setLoading(true);
    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const cookies = new Cookies(null, { path: "/" });
    let accessToken = cookies.get("jwt-access-ruemin");
    if (!accessToken) {
      accessToken = await fetchToken();
    }

    if (accessToken) {
      const file = inputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      fetch(`${apiURL}/profiles/${user.profile.id}/picture`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) console.log(data.error.msg);
          if (data.updated) {
            setUser({ ...user, profile: { ...user.profile, ...data.updated } });
          }
          setEditContent(null);
        });
    }
  };

  return (
    <div className="overlay overlay--no-scroll">
      <div className="profile-edit">
        <div className="overlay__header">
          <div className="profile-edit__title">Upload Picture</div>
          <button
            className="close-overlay"
            onClick={() => setEditContent(null)}
          >
            <span>
              <Icon path={mdiClose} size={1} />
            </span>
          </button>
        </div>
        <div className="profile-edit__block">
          <label className="upload">
            <span className="upload__icon">
              <Icon path={mdiPlus} size={1} />
            </span>
            <span>Upload</span>
            <input
              className="upload__input"
              ref={inputRef}
              type="file"
              name="picture"
              onChange={handleUpload}
              disabled={loading}
            />
            {loading && (
              <div className="loading">
                <Icon className="loading__icon" path={mdiLoading} size={1.2} />
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditPicture;
