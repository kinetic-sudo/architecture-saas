// types.ts - UPDATED
interface AuthState {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null
}

type authContext = {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
    isAuthLoading: boolean; // ADD THIS
    refreshAuth: () => Promise<boolean>;
    signIn: () => Promise<boolean>;
    signOut: () => Promise<boolean>
}