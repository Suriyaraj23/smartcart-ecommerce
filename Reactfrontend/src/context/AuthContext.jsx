import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = (loginData) => {
    const normalizedRole = loginData.role
      ? String(loginData.role).toUpperCase()
      : "CUSTOMER";

    localStorage.setItem("token", loginData.token);
    localStorage.setItem("role", normalizedRole);

    if (
      loginData.userId !== null &&
      loginData.userId !== undefined
    ) {
      localStorage.setItem(
        "userId",
        String(loginData.userId)
      );
    }

    if (loginData.name) {
      localStorage.setItem("name", loginData.name);
    }

    if (loginData.email) {
      localStorage.setItem("email", loginData.email);
    }

    setToken(loginData.token);
    setRole(normalizedRole);

    return normalizedRole;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}