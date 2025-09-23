
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthChange, User } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (user && pathname === '/login') {
          router.replace('/dashboard');
      }
    });

    // Check for guest status in session storage
    const guestStatus = sessionStorage.getItem('isGuest');
    if (guestStatus === 'true') {
        setIsGuest(true);
    }


    return () => unsubscribe();
  }, [router, pathname]);

  const setGuest = () => {
    setIsGuest(true);
    sessionStorage.setItem('isGuest', 'true');
    router.push('/dashboard');
  };

  const value = { user, loading, isGuest, setGuest };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
