import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
    role: {
      id: "",
      name: "",
    },
    address: "",
    age: "",
    permissions: [],
  },
  isAppLoading: true,
});

export const AuthWrraper = (props) => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    name: "",
    role: {
      id: "",
      name: "",
    },
    address: "",
    age: "",
    permissions: [],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isAppLoading,
        setIsAppLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
