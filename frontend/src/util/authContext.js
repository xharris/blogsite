import { createContext, useContext } from "react";

const userContext = createContext({ user: null });
export const useAuthContext = () => useContext(userContext);

export default userContext;
