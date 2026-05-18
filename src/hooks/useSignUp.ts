import { useState } from 'react';
import {
  signUpUser,
  signUpOwner,
  type SignUpUserParams,
  type SignUpOwnerParams,
} from '../services/auth/authService';

export interface SignUpResult {
  success: boolean;
  needsVerification: boolean;
  backendUserId?: string;
  restaurantId?: string | null;
}

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (params: SignUpUserParams): Promise<SignUpResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUpUser(params);
      return {
        success: true,
        needsVerification: result.needsVerification,
        backendUserId: result.backendUserId,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo.';
      setError(message);
      return { success: false, needsVerification: false };
    } finally {
      setLoading(false);
    }
  };

  const registerOwner = async (params: SignUpOwnerParams): Promise<SignUpResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUpOwner(params);
      return {
        success: true,
        needsVerification: result.needsVerification,
        backendUserId: result.backendUserId,
        restaurantId: result.restaurantId,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo.';
      setError(message);
      return { success: false, needsVerification: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser, registerOwner };
}
