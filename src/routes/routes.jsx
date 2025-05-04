import Homepage from "../pages/home";
import Login from "../pages/login";
import App from "../App";
import Signup from "../pages/signup";
import Chat from "../pages/chat";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Homepage />,
        children: [
          {
            index: true,
            element: <div>Start A Conversation!</div>,
          },
          {
            path: "messages/:chatId",
            element: <Chat />,
          },
        ],
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
