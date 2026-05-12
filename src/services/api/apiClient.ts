import axios from 'axios';

// Get base URL from environment or use fallback
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding authentication token later (when Bearer auth is implemented)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add Bearer token from secure storage when auth is implemented
    // const token = await SecureStore.getItemAsync('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
