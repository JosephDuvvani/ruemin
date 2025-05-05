import { createContext } from "react";

const RequestContext = createContext(null);

const RequestProvider = RequestContext.Provider;

export { RequestProvider };
export default RequestContext;
