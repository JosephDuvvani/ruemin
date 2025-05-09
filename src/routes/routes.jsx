import Homepage from "../pages/home";
import Login from "../pages/login";
import App from "../App";
import Signup from "../pages/signup";
import Chat from "../pages/chat";
import Chatters from "../pages/chatters";
import InChat from "../components/in-chat";
import Suggestions from "../components/suggetstions";
import Requests from "../components/requests";

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
            element: (
              <div className="message-block-empty-msg">
                Start A Conversation!
              </div>
            ),
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
      {
        path: "chatters",
        element: <Chatters />,
        children: [
          {
            index: true,
            element: <InChat />,
          },
          {
            path: "suggestions",
            element: <Suggestions />,
          },
          {
            path: "requests",
            element: <Requests />,
          },
        ],
      },
    ],
  },
];

export default routes;
