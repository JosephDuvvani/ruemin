import Homepage from "../pages/home";
import Login from "../pages/login";
import App from "../App";
import Signup from "../pages/signup";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <h1>Error</h1>,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
];

export default routes;
