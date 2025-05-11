import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import fetchToken from "../utils/refresh-auth";
import UserContext from "../context/user-context";

const EditNameForm = ({ setEditContent }) => {
  const { user, setUser } = useContext(UserContext);
  const [first, setFirst] = useState(user.profile?.firstname);
  const [last, setLast] = useState(user.profile?.lastname);

  const firstChars = 30 - first.length;
  const lastChars = 30 - last.length;

  const handleSave = async (e) => {
    e.preventDefault();

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
          firstname: first.trim(),
          lastname: last.trim(),
        }),
      };

      fetch(`${apiURL}/profiles/${user.profile.id}/name`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.updated) {
            setUser({ ...user, profile: { ...user.profile, ...data.updated } });
            setEditContent(null);
          }
        });
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="edit-form">
        <input
          className="edit-form__input"
          type="text"
          name="firstname"
          placeholder="Firstname"
          aria-label="Your new firstname"
          autoComplete="off"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <input
          className="edit-form__input"
          type="text"
          name="lastname"
          placeholder="Lastname"
          aria-label="Your new lastname"
          autoComplete="off"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />

        <div className="edit-form__btns">
          <button
            className="edit-form__btn"
            type="submit"
            disabled={
              firstChars === 30 ||
              firstChars < 0 ||
              lastChars < 0 ||
              (first === user.profile.firstname &&
                last === user.profile.lastname)
            }
          >
            Save
          </button>
          <button
            className="edit-form__btn edit-form__btn--cancel"
            type="button"
            onClick={() => setEditContent(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditNameForm;
