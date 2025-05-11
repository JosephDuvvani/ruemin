import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import UserContext from "../context/user-context";

const EditBioForm = ({ setEditContent }) => {
  const { user, setUser } = useContext(UserContext);
  const [bio, setBio] = useState(user.profile?.bio || "");

  const inputRef = useRef();

  const chars = 101 - (bio?.length || 0);

  useEffect(() => {
    inputRef.current.textContent = bio || "";
    inputRef.current.focus();

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(inputRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (chars < 0 || chars === 101) return;

    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const cookies = new Cookies(null, { path: "/" });
    let accessToken = cookies.get("jwt-access-ruemin");
    if (!accessToken) {
      accessToken = await fetchToken();
    }

    if (accessToken) {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: bio.trim(),
        }),
      };

      fetch(`${apiURL}/profiles/${user.profile.id}/bio`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.updated) {
            setUser({ ...user, profile: { ...user.profile, ...data.updated } });
            setEditContent(null);
          }
        });
    }
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      if (
        !(
          bio.trim() == "" ||
          chars < 0 ||
          chars === 101 ||
          bio == user.profile.bio
        )
      )
        handleSave();
    }
  };

  return (
    <div>
      <div className="edit-form">
        <div className="custom-input-wrapper bio-input-wrapper">
          {bio == "" && (
            <span className="custom-placeholder" aria-hidden>
              Describe yourself
            </span>
          )}
          <div
            className="edit-form__textarea"
            ref={inputRef}
            aria-label="Describe yourself"
            contentEditable="true"
            onInput={(e) => setBio(e.target.textContent)}
            onKeyDown={handleEnter}
          ></div>
        </div>

        <div className="edit-form__char-limit">
          {chars} characters remaining
        </div>

        <div className="edit-form__btns">
          <button
            className="edit-form__btn"
            onClick={handleSave}
            disabled={
              bio.trim() == "" ||
              chars < 0 ||
              chars === 101 ||
              bio == user.profile.bio
            }
          >
            Save
          </button>
          <button
            className="edit-form__btn edit-form__btn--cancel"
            onClick={() => setEditContent(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBioForm;
