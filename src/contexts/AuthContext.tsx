import React, { createContext, useContext } from "react";

export interface AuthContextType {
  session: unknown;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const noop = async () => {};
export const AuthContext = createContext<AuthContextType>({
  session: null,
  signIn: noop,
  signOut: noop,
});

export const useAuth = () => useContext(AuthContext);
