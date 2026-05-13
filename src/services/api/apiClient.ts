import axios from 'axios';
import { Platform } from 'react-native';
import { parseApiError } from './errors';

// Render free-tier can take up to 30 s on cold starts
const TIMEOUT_MS = 30_000;

// Default base URL resolution:
// - Use `EXPO_PUBLIC_API_BASE_URL` if provided (recommended for production/testing).
// - On Android emulator (AVD) `localhost` refers to the emulator; use 10.0.2.2 to reach host machine.
// - Otherwise fallback to localhost for iOS simulator and web.
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Bearer token when auth is implemented
apiClient.interceptors.request.use(
  (config) => {
    // TODO: read token from expo-secure-store once auth (Phase 5) is live
    // const token = await SecureStore.getItemAsync('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(parseApiError(error))
);

// Response interceptor — normalize errors into ApiError
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(parseApiError(error))
);

export default apiClient;
