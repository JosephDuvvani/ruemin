import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import isAuth from "../utils/guardAuth";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
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
      }),
    };

    fetch(`${apiURL}/login`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) setError(data.errors[0]);
        else if (data.error) console.error(data.error.message);
        else {
          const { accessToken, refreshToken } = data;
          cookies.set("jwt-access-ruemin", accessToken);
          cookies.set("jwt-refresh-ruemin", refreshToken);
          navigate("/", { replace: true });
        }
      });
  };

  return (
    <div className="auth">
      <div className="auth__title">RUEMIN</div>
      <div className="auth__tag">
        Step in, log in, and let the conversations flow. Connect securely, chat
        freely!
      </div>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn">Log In</button>
      </form>
      {error && <div className="auth__error">{error.msg}</div>}
      <div className="btn">
        <Link to={"../signup"}>Create new account</Link>
      </div>
    </div>
  );
};

export default Login;
