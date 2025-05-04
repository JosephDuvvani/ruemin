import { createContext } from "react";

const UserContext = createContext(null);

const UserProvider = UserContext.Provider;

export { UserProvider };
export default UserContext;
