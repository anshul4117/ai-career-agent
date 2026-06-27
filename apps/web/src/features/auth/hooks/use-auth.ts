import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setLoading } = useAuthStore();

  const login = async (email: string, password: string) => {
    // TODO: Integrate Clerk sign-in triggers in Sprint 7
    setLoading(true);
    try {
      return await authService.login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    // TODO: Integrate Clerk sign-up triggers in Sprint 7
    setLoading(true);
    try {
      return await authService.register(email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // TODO: Integrate Clerk sign-out triggers in Sprint 7
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}
