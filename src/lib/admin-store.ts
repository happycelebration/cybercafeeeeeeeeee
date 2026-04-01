import { create } from 'zustand';

interface AdminState {
  isAdmin: boolean;
  adminEmail: string | null;
  adminName: string | null;
  token: string | null;
  login: (email: string, name: string, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  adminEmail: null,
  adminName: null,
  token: null,
  login: (email, name, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_name', name);
    }
    set({ isAdmin: true, adminEmail: email, adminName: name, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_name');
    }
    set({ isAdmin: false, adminEmail: null, adminName: null, token: null });
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const email = localStorage.getItem('admin_email');
      const name = localStorage.getItem('admin_name');
      if (token && email) {
        set({ isAdmin: true, adminEmail: email, adminName: name, token });
      }
    }
  },
}));
