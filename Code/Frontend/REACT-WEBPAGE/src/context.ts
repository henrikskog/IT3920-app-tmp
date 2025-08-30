import { createContext } from "react";

export const UserContext = createContext({
  name: "",
  setName: (username: string) => {
    console.log(username);
  },
});
