import { createContext } from "react";

import type { User } from "../types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  full_name: string;
  phone_number: string;
  confirm_password: string;
}

export interface ProfilePayload {
  full_name: string;
  phone_number: string;
  profile: {
    city: string;
    qualification: string;
    bio: string;
  };
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User | null>;
  updateProfile: (payload: ProfilePayload) => Promise<User>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
