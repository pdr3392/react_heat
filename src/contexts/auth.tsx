import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface UserProps {
  id: string;
  name?: string;
  login: string;
  avatar_url: string;
}

interface AuthContextData {
  user: UserProps | null;
  signInUrl: string;
  signOut: () => void;
}

interface AuthProvider {
  children: ReactNode;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name?: string;
    login: string;
  };
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<UserProps | null>(null);

  const signInUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=22831525c129e697d117`;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem("@dowhile:token", token);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      api.get<UserProps>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
