import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canAccessAdmin: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isSuperAdmin: false,
  canAccessAdmin: false
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth(); // Move inside component
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setIsAdmin(auth.user.role === 'admin' || auth.user.role === 'superadmin');
      setIsSuperAdmin(auth.user.role === 'superadmin');
    } else {
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  }, [auth.user]);

  const canAccessAdmin = isAdmin || isSuperAdmin;

  return (
    <AdminContext.Provider value={{ isAdmin, isSuperAdmin, canAccessAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};            