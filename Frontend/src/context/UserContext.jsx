import { createContext, useState } from "react";
import React from "react";

//data creation
export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  });
  return (
    <div>
      <UserDataContext.Provider value={user}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
