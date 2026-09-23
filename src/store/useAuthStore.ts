import { create } from "zustand";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { loginUser } from "../lib/api";

interface AuthState {
  user: {
    id: string;
    email: string;
    role: string;
    full_name: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: any) => void;
  initialize: () => () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },
      initialize: () => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
          if (!firebaseUser) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }
          try {
            const token = await firebaseUser.getIdToken();
            const session = await loginUser({ idToken: token });
            set({ user: session.user, isAuthenticated: true, isLoading: false });
          } catch {
            await signOut(firebaseAuth);
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },
      logout: () => {
        void signOut(firebaseAuth);
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }));
