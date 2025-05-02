import Homepage from "../pages/home";
import Login from "../pages/login";
import App from "../App";

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
    ],
  },
];

export default routes;
