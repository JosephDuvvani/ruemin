import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import isAuth from "../utils/guardAuth";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/user-context";

const Signup = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [error, setError] = useState();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const cookies = new Cookies(null, { path: "/" });

  useEffect(() => {
    if (isAuth()) navigate("/", { replace: true });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        firstname,
        lastname,
      }),
    };

    fetch(`${apiURL}/signup`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) setError(data.errors[0]);
        else if (data.error) console.error(data.error.message);
        else {
          const { accessToken, refreshToken } = data;
          const decodeAccess = jwtDecode(accessToken);
          const decodeRefresh = jwtDecode(refreshToken);

          cookies.set("jwt-access-ruemin", accessToken, {
            expires: new Date(decodeAccess.exp * 1000),
          });
          cookies.set("jwt-refresh-ruemin", refreshToken, {
            expires: new Date(decodeRefresh.exp * 1000),
          });

          setUser({ id: decodeAccess.id, username: decodeAccess.username });
          navigate("/", { replace: true });
        }
      });
  };

  return (
    <div>
      <div className="auth h-100v">
        <div className="auth__title">RUEMIN</div>
        <div className="auth__tag">
          Step up, sign up, and let the conversations flow. Connect securely,
          chat freely!
        </div>
        <form onSubmit={handleSubmit} className="auth__form">
          <div className="input-wrapper">
            <label>
              <input
                className="auth__form__input"
                type="text"
                name="username"
                aria-label="Your username"
                placeholder="Username"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
              {error && error.path === "username" && (
                <div className="auth__error--signup">{error.msg}</div>
              )}
            </label>
          </div>
          <div className="input-wrapper">
            <label>
              <input
                className="auth__form__input"
                type="password"
                name="password"
                aria-label="Your password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && error.path === "password" && (
                <div className="auth__error--signup">{error.msg}</div>
              )}
            </label>
          </div>
          <div className="input-wrapper">
            <label>
              <input
                className="auth__form__input"
                type="text"
                name="firstname"
                aria-label="Your firstname"
                placeholder="Firstname"
                autoComplete="off"
                onChange={(e) => setFirstname(e.target.value)}
              />
              {error && error.path === "firstname" && (
                <div className="auth__error--signup">{error.msg}</div>
              )}
            </label>
          </div>
          <div className="input-wrapper">
            <label>
              <input
                className="auth__form__input"
                type="text"
                name="lastname"
                aria-label="Your lastname"
                placeholder="Lastname"
                autoComplete="off"
                onChange={(e) => setLastname(e.target.value)}
              />
              {error && error.path === "lastname" && (
                <div className="auth__error--signup">{error.msg}</div>
              )}
            </label>
          </div>

          <button className="auth__form__btn">Sign Up</button>

          <div className="btn">
            <Link to={"../login"} className="auth__form__link auth__form__btn">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
