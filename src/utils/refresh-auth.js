import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const fetchToken = async () => {
  const apiURL = import.meta.env.VITE_RUEMIN_API_URL;
  const cookies = new Cookies(null, { path: "/" });
  const refreshToken = cookies.get("jwt-refresh-ruemin");
  const url = `${apiURL}/token`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: refreshToken,
    }),
  };

  const data = await (await fetch(url, options)).json();

  if (data.error) throw new Error(data.error.msg || "Athentication error");

  const decode = jwtDecode(data.accessToken);
  cookies.set("jwt-access-ruemin", data.accessToken, {
    expires: new Date(decode.exp * 1000),
  });
  return data.accessToken;
};

export default fetchToken;
