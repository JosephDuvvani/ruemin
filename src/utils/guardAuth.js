import Cookies from "universal-cookie";

const isAuth = () => {
  const cookies = new Cookies(null, { path: "/" });
  const token = cookies.get("jwt-refresh-ruemin");
  if (!token) return false;
  return true;
};

export default isAuth;
