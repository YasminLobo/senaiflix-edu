import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  type: "infantil" | "jovem" | "adulto";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, type: User["type"]) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("senaiflix_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const usersData = localStorage.getItem("senaiflix_users");
    const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("senaiflix_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string, type: User["type"]): Promise<boolean> => {
    const usersData = localStorage.getItem("senaiflix_users");
    const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
    
    if (users.find(u => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      type
    };
    
    users.push(newUser);
    localStorage.setItem("senaiflix_users", JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("senaiflix_user", JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("senaiflix_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
