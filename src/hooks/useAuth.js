import { useAuthStore } from '../store/authStore';
import api, { endpoints } from '../utils/api';

export function useAuth() {
  const { user, isAuthenticated, accessToken, loginSuccess, logout: storeLogout, setUser } = useAuthStore();

  const login = async (email, password) => {
    const response = await api.post(endpoints.login, { email, password });
    loginSuccess(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post(endpoints.register, userData);
    return response.data;
  };

  const logout = () => storeLogout();

  return { user, isAuthenticated, accessToken, login, register, logout, setUser };
}
