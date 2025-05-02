import { useEffect } from "react";
import { Outlet, replace, useNavigate } from "react-router-dom";
import isAuth from "./utils/guardAuth";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) navigate("login", { replace: true });
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
