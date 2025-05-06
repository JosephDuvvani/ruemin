import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import isAuth from "../utils/guardAuth";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/user-context";
import "../assets/styles/auth-forms.css";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

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
      }),
    };

    fetch(`${apiURL}/login`, options)
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
        <h1 className="auth__title">RUEMIN</h1>
        <h2 className="auth__tag">
          Step in, log in, and let the conversations flow. Connect securely,
          chat freely!
        </h2>
        <form onSubmit={handleSubmit} className="auth__form">
          <input
            className="auth__form__input"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="auth__form__input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth__form__btn">Log In</button>
          <Link to={"../signup"} className="auth__form__link auth__form__btn">
            Create new account
          </Link>
        </form>
        {error && <div className="auth__error">{error.msg}</div>}
      </div>
    </div>
  );
};

export default Login;
