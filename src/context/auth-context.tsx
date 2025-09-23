
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthChange, User, doSignOut } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const guestStatus = sessionStorage.getItem('isGuest');
    if (guestStatus === 'true') {
        setIsGuest(true);
        setLoading(false);
    } else {
        const unsubscribe = onAuthChange((user) => {
          setUser(user);
          setLoading(false);
          if (user && (pathname === '/login' || pathname === '/')) {
              router.replace('/dashboard');
          }
        });
        return () => unsubscribe();
    }
  }, [router, pathname]);

  const setGuest = () => {
    setIsGuest(true);
    sessionStorage.setItem('isGuest', 'true');
    router.push('/dashboard');
  };

  const logout = async () => {
    await doSignOut();
    setUser(null);
    setIsGuest(false);
    router.push('/login');
  };

  const value = { user, loading, isGuest, setGuest, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
