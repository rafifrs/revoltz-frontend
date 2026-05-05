import { create } from 'zustand';

const TOKEN_KEY = 'revoltz_access_token';
const USER_KEY = 'revoltz_user';

function loadToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: loadUser(),
  isAuthenticated: !!loadToken(),
  accessToken: loadToken(),

  loginSuccess: (data) => {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    set({ user: data.user, isAuthenticated: true, accessToken: data.access_token });
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, isAuthenticated: false, accessToken: null });
  },
}));
